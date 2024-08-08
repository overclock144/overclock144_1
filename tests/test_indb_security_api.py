import pytest
from flask import json
from flask_appbuilder.security.sqla.models import User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash

from indb.security.api import IndbSecurityApi
from indb.security.models import UserSessionLog


@pytest.fixture(scope="function")
def user(session):
    user = User(
        username="test_user",
        password=generate_password_hash("test_password"),
        first_name="Test",
        last_name="User",
        active=True,
        email="testuser@indb.com",
    )
    session.add(user)
    session.commit()
    return user


@pytest.fixture(scope="function")
def user_session(session, user):
    user_session = UserSessionLog(user=user, is_active=True)
    session.add(user_session)
    session.commit()
    return user_session


api_url = "/api/v1/security"


def test_login_json_payload(client):
    """Test login endpoint with non-JSON payload"""
    response = client.post(f"{api_url}/login", data="not a json")
    assert response.status_code == 400
    assert response.json["message"] == "Request payload is not JSON"


def test_login_validation_error(client):
    """Test login endpoint with empty JSON payload"""
    response = client.post(f"{api_url}/login", json={})
    assert response.status_code == 400


def test_login_active_session(client, user_session):
    """Test login endpoint when user already has an active session"""
    response = client.post(
        f"{api_url}/login",
        json={"username": "test_user", "password": "test_password", "provider": "db"},
    )
    assert response.status_code == 400
    assert response.json["message"] == "User already has an active session"


def test_login_success(client, session, user, user_session):
    """Test successful login and activation of user session"""
    user_session.is_active = False
    session.commit()

    response = client.post(
        f"{api_url}/login",
        json={"username": "test_user", "password": "test_password", "provider": "db"},
    )
    assert response.status_code == 200


def test_logout_user_not_logged_in(client):
    """Test logout endpoint when no user is logged in"""
    response = client.get(f"{api_url}/logout-user")
    assert response.status_code == 401


def test_logout_user_success(client, app, session, user, user_session):
    """Test successful logout of a logged-in user"""
    with app.app_context():
        access_token = create_access_token(identity=user.id, fresh=True)
        headers = {"Authorization": f"Bearer {access_token}"}

        response = client.get(f"{api_url}/logout-user", headers=headers)
        assert response.status_code == 200
        assert response.json["message"] == "User logged out successfully"

        # Verify the session is set to inactive
        assert not user_session.is_active
