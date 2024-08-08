"""Application Initializer class."""

import logging
from typing import Any

from flask import Flask

from indb.api import HealthCheckApi
from indb.api import ProcessQuestionApi
from indb.constants import PROJECT_ROOT
from indb.extensions import app_builder, db, migrate
from indb.security.manager import IndbSecurityManager

logger = logging.getLogger(__name__)


class AppInitializer:  # pylint: disable=too-many-public-methods
    """AppInitializer class for initializing the app"""

    def __init__(self, app: Flask) -> None:
        super().__init__()

        self.indb_app = app
        self.config = app.config

    @property
    def flask_app(self) -> Flask:
        """Return the Flask app"""
        return self.indb_app

    def pre_init(self) -> None:
        """
        Called before all other init tasks are complete
        """

    def post_init(self) -> None:
        """
        Called after any other init tasks
        like creating admin user
        """

    def init_api_views(self) -> None:
        """Initialize api view"""
        app_builder.add_api(HealthCheckApi)
        app_builder.add_api(ProcessQuestionApi)

    def init_app(self) -> None:
        """
        Main entry point which will delegate to other methods in
        order to fully init the app
        """
        self.pre_init()
        self.configure_logging()
        self.setup_db()

        with self.indb_app.app_context():
            self.configure_fab()
            self.init_api_views()

        # will be un commented when we have blueprints
        # self.register_blueprints()

        self.post_init()

    def configure_fab(self) -> None:
        """Configure Flask App Builder"""
        app_builder.security_manager_class = IndbSecurityManager
        app_builder.init_app(self.indb_app, db.session)

    def configure_logging(self) -> None:
        """Configure logging for the app"""
        self.config["LOGGING_CONFIGURATOR"].configure_logging(
            self.config, self.indb_app.debug
        )

    def setup_db(self) -> None:
        """Setup the database connection"""
        db.init_app(self.indb_app)

        # handle migrations
        migrate.init_app(
            self.indb_app,
            db=db,
            render_as_batch=True,
            directory=PROJECT_ROOT / "migrations",
        )

        # create the database tables
        with self.indb_app.app_context():
            db.create_all()

    def register_blueprints(self) -> None:
        """Register blueprints with the app"""
        for bp in self.config["BLUEPRINTS"]:
            try:
                logger.info("Registering blueprint: %s \n", bp.name)
                self.indb_app.register_blueprint(bp)
            except Exception:  # pylint: disable=broad-except
                logger.exception("blueprint registration failed \n")
