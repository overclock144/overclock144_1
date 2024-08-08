"""Security models for tracking user sessions."""

from flask_appbuilder import Model
from sqlalchemy import Boolean, Column, ForeignKey, Integer
from sqlalchemy.orm import backref, relationship

from indb.mixins import Timestamp


class UserSessionLog(Model, Timestamp):
    """Model for tracking user sessions."""

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    user = relationship(
        "User", backref=backref("session_logs", uselist=True), foreign_keys=[user_id]
    )
    is_active = Column(Boolean, default=False)

    def __repr__(self) -> str:
        return f"{self.user.username} - {self.is_active} - {self.created_on}"
