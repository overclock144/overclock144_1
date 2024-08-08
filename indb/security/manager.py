"""Custom Security manager for overriding fab's security manager."""

from flask_appbuilder.security.sqla.manager import SecurityManager

from indb.security.api import IndbSecurityApi


class IndbSecurityManager(SecurityManager):
    """Custom Security manager for overriding fab's security manager."""

    security_api = IndbSecurityApi
