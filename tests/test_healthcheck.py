"""Test the healthcheck endpoint."""


def test_healthcheck(client):
    """Test the healthcheck endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.data == b"OK"
