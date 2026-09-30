import sys
import os

# Add server directory to sys.path
SERVER_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if SERVER_DIR not in sys.path:
    sys.path.insert(0, SERVER_DIR)

import pytest
from fastapi.testclient import TestClient
import db

@pytest.fixture(autouse=True)
def setup_test_db(tmp_path):
    """
    Creates a temporary SQLite database for each test function to ensure total isolation.
    """
    test_db_file = str(tmp_path / "test_prep_os.db")
    original_db_path = db.DB_PATH
    db.DB_PATH = test_db_file

    # Initialize schema
    db.init_db()

    yield test_db_file

    # Restore original path
    db.DB_PATH = original_db_path

@pytest.fixture
def client(setup_test_db):
    """FastAPI TestClient fixture."""
    from main import app
    with TestClient(app) as test_client:
        yield test_client
