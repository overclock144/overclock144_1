"""Common and shared mixins"""

from datetime import datetime

from sqlalchemy import Column, DateTime


class Timestamp:  # pylint: disable=too-few-public-methods
    """Timestamp that adds
    created_on: when it was created
    updated_on: when it was updated
    """

    created_on = Column(DateTime, default=datetime.now())
    changed_on = Column(
        DateTime,
        default=datetime.now(),
        onupdate=datetime.now(),
    )
