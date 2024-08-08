"""Custom security API for the Indb application.
to allow for custom login flow.
"""

import logging

from flask import Response, request
from flask_appbuilder.api import safe
from flask_appbuilder.const import API_SECURITY_PROVIDER_DB
from flask_appbuilder.security.api import SecurityApi
from flask_appbuilder.security.schemas import login_post
from flask_appbuilder.views import expose
from flask_jwt_extended import get_jwt_identity, jwt_required, unset_jwt_cookies
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from indb.extensions import db
from indb.security.models import UserSessionLog

logger = logging.getLogger(__name__)


class IndbSecurityApi(SecurityApi):
    """Custom security API for the Indb application.
    to allow for custom login flow.
    """

    @expose("/login", methods=["POST"])
    @safe
    def login(self) -> Response:
        """Overriding the login method to
        not allow users to have more than one active
        session at a time.
        """

        if not request.is_json:
            logger.error("Request payload is not JSON")
            return self.response_(message="Request payload is not JSON")

        try:
            login_payload = login_post.load(request.json)
        except ValidationError as error:
            logger.error("Validation error: %s", error.messages)
            return self.response_400(message=error.messages)
        print(login_payload)
        username: str = login_payload["username"]

        # Check if the user has an active session
        active_session: UserSessionLog = (
            db.session.query(UserSessionLog)  # pylint:disable=no-member
            .filter(
                UserSessionLog.user.has(username=username),
                UserSessionLog.is_active == True,  # pylint:disable=singleton-comparison
            )
            .first()
        )

        if active_session:
            logger.error("User %s already has an active session", username)
            return self.response_400(message="User already has an active session")

        # Authentication
        user = None
        provider: str = login_payload.get("provider")

        if provider == API_SECURITY_PROVIDER_DB:
            user = self.appbuilder.sm.auth_user_db(username, login_payload["password"])
        else:
            logger.error("Unsupported provider: %s", provider)
            return self.response_400(message="Unsupported provider")

        if not user:
            return self.response_401()

        # Create a new session log
        session_log: UserSessionLog = UserSessionLog(user=user, is_active=True)
        db.session.add(session_log)  # pylint:disable=no-member
        db.session.commit()  # pylint:disable=no-member

        return super().login()

    @expose("/logout-user", methods=["GET"])
    @jwt_required()
    def logout(self) -> Response:
        """Logout a user and set the session to inactive."""

        user_id: int = get_jwt_identity()

        try:
            # get the user session
            user_session: UserSessionLog = (
                db.session.query(UserSessionLog)  # pylint:disable=no-member
                .filter(
                    UserSessionLog.user_id == user_id,
                    UserSessionLog.is_active  # pylint:disable=singleton-comparison
                    == True,
                )
                .first()
            )

            if user_session:
                user_session.is_active = False
                db.session.commit()  # pylint:disable=no-member

            response: Response = self.response(
                200, message="User logged out successfully"
            )

            # unset the jwt cookies
            unset_jwt_cookies(response)

            return response

        except SQLAlchemyError as e:
            logger.error("Database error logging out user: %s", e)
            return self.response_500(message="Database error logging out user")
        except Exception as e:  # pylint: disable=broad-except
            logger.error("Unexpected error logging out user: %s", e)
            return self.response_500(message="Unexpected error logging out user")
