import os
import shutil
import tempfile

def create_fastapi_project(project_name):
    folders = [
        "app",
        "app/api",
        "app/api/v1",
        "app/api/v1/endpoints",
        "app/core",
        "app/models",
        "app/schemas",
        "app/crud",
        "app/db",
        "app/services",
        "app/utils",
        "tests",
    ]

    files = {
        "app/main.py": """
from fastapi import FastAPI
from app.api.v1.api import api_router

app = FastAPI(title="My FastAPI App")

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"msg": "API Running"}
""",

        "app/api/v1/api.py": """
from fastapi import APIRouter
from app.api.v1.endpoints import user

api_router = APIRouter()
api_router.include_router(user.router, prefix="/users", tags=["Users"])
""",

        "app/api/v1/endpoints/user.py": """
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_users():
    return [{"name": "Lee"}]
""",

        "app/core/config.py": """
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
""",

        "app/db/session.py": """
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
""",

        "app/models/user.py": """
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
""",

        "app/schemas/user.py": """
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
""",

        "app/crud/user.py": """
from app.models.user import User

def create_user(db, user):
    db_user = User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
""",

        "app/db/base.py": """
from sqlalchemy.orm import declarative_base

Base = declarative_base()
""",

        "tests/test_main.py": """
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
""",

        "requirements.txt": """
fastapi
uvicorn
sqlalchemy
pydantic
python-dotenv
""",

        ".env": """
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=supersecret
""",

        "README.md": "# FastAPI Project",
    }

    # Create a temporary directory for the project files
    tmp_path = tempfile.mkdtemp()
    project_path = os.path.join(tmp_path, project_name)
    os.makedirs(project_path, exist_ok=True)

    # Create folders
    for folder in folders:
        os.makedirs(os.path.join(project_path, folder), exist_ok=True)

    # Create files
    for path, content in files.items():
        full_path = os.path.join(project_path, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w") as f:
            f.write(content.strip())

    # Create zip archive in /tmp to avoid project directory pollution
    zip_base_name = os.path.join("/tmp", project_name)
    zip_file_path = shutil.make_archive(zip_base_name, 'zip', project_path)
    
    # Clean up the temporary project directory
    shutil.rmtree(tmp_path)

    return zip_file_path