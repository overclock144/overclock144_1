"""This module contains fixtures for the tests."""

import pytest

from indb.app import create_app
from indb.extensions import db as _db


@pytest.fixture(scope="session")
def app():
    """Create and configure a new app instance for each test."""
    indb_app = create_app("config.TestingConfig")

    yield indb_app


@pytest.fixture(scope="function")
def client(app):  # pylint: disable=redefined-outer-name
    """A test client for the app."""
    return app.test_client()


@pytest.fixture(scope="session")
def runner(app):  # pylint: disable=redefined-outer-name
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


@pytest.fixture(scope="session")
def db(app, request):
    """Session-wide test database."""

    def teardown():
        _db.drop_all()

    _db.app = app

    _db.create_all()
    request.addfinalizer(teardown)
    return _db


@pytest.fixture(scope="function")
def session(db, request):
    db.session.begin_nested()

    def commit():
        db.session.flush()

    # patch commit method
    old_commit = db.session.commit
    db.session.commit = commit

    def teardown():
        db.session.rollback()
        db.session.close()
        db.session.commit = old_commit

    request.addfinalizer(teardown)
    return db.session
