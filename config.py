"""Main Config of the app"""

import datetime
import logging
import os

from flask import Blueprint

from indb.utils.logging_configurator import DefaultLoggingConfigurator


class Config:  # pylint: disable=too-few-public-methods
    """Main Config of the app"""

    SECRET_KEY = os.getenv("SECRET_KEY")
    TESTING = False

    # list of blueprints in the app
    BLUEPRINTS: list[Blueprint] = []

    LOGGING_CONFIGURATOR = DefaultLoggingConfigurator()
    LOG_FORMAT = "%(asctime)s:%(levelname)s:%(name)s:%(message)s"
    LOG_LEVEL = logging.INFO
    ENABLE_TIME_ROTATE = False
    TIME_ROTATE_LOG_LEVEL = logging.INFO
    FILENAME = "bsm.log"
    ROLLOVER = "midnight"
    INTERVAL = 1
    BACKUP_COUNT = 30

    # Fab Config
    FAB_API_SWAGGER_UI = True
    APP_NAME = "Indb"
    APP_THEME = "lumen.css"
    FAB_SECURITY_MANAGER_CLASS = "indb.security.manager.IndbSecurityManager"

    # JWT Config
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=1)


class DevelopmentConfig(Config):  # pylint: disable=too-few-public-methods
    """Development Config of the app"""

    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")


class ProductionConfig(Config):  # pylint: disable=too-few-public-methods
    """Production Config of the app"""

    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")


class TestingConfig(Config):  # pylint: disable=too-few-public-methods
    """Testing Config of the app"""

    SQLALCHEMY_DATABASE_URI = "sqlite:///test.db"
    TESTING = True
    DEBUG = True
    SECRET_KEY = "this is a secret"
