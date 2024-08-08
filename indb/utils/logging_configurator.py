"""Logging configurator module."""

import abc
import logging
from logging.handlers import TimedRotatingFileHandler

import flask.app
import flask.config

logger = logging.getLogger(__name__)


class LoggingConfigurator(abc.ABC):  # pylint: disable=too-few-public-methods
    """Interface for logging configurators."""

    @abc.abstractmethod
    def configure_logging(
        self, app_config: flask.config.Config, debug_mode: bool
    ) -> None:
        """Configure logging for the application."""


class DefaultLoggingConfigurator(  # pylint: disable=too-few-public-methods
    LoggingConfigurator
):
    """Default logging configurator."""

    def configure_logging(
        self, app_config: flask.config.Config, debug_mode: bool
    ) -> None:
        """Configure logging for the application."""

        # configure indb app logger
        indb_logger = logging.getLogger("indb")
        if debug_mode:
            indb_logger.setLevel(logging.DEBUG)
        else:
            # In production mode, add log handler to sys.stderr.
            indb_logger.addHandler(logging.StreamHandler())
            indb_logger.setLevel(logging.INFO)

        logging.getLogger("pyhive.presto").setLevel(logging.INFO)

        logging.basicConfig(format=app_config["LOG_FORMAT"])
        logging.getLogger().setLevel(app_config["LOG_LEVEL"])

        if app_config["ENABLE_TIME_ROTATE"]:
            logging.getLogger().setLevel(app_config["TIME_ROTATE_LOG_LEVEL"])
            handler = TimedRotatingFileHandler(
                app_config["FILENAME"],
                when=app_config["ROLLOVER"],
                interval=app_config["INTERVAL"],
                backupCount=app_config["BACKUP_COUNT"],
            )
            logging.getLogger().addHandler(handler)

        logger.debug("logging was configured successfully \n")
