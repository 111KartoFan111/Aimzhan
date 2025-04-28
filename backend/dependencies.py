from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core.auth import oauth2_scheme
from app.config import settings
from app.database import get_db

# Вспомогательные зависимости для FastAPI