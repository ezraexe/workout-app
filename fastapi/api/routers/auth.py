from datetime import timedelta, datetime, timezone 
from typing import Annotated 
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel 
from jose import jwt, JWTError
from dotenv import load_dotenv 
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer 
import os 
from api.models import User  
from api.deps import db_dependency, bcrypt_context 

load_dotenv() 

router = APIRouter(
  prefix='/auth', 
  tags=['auth']
)

SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

class UserCreateRequest(BaseModel): 
  username: str 
  password: str 
  
class Token(BaseModel): 
  access_token: str 
  token_type: str 
  
def authenticate_user(username: str, password: str, db: db_dependency): 
  user = db.query(User).filter(User.username == username).first() 
  if not user: # no user found 
    return False 
  if not bcrypt_context.verify(password, user.hashed_password): 
    return False 
  return user

def create_access_token(username: str, user_id: int, expires_delta: timedelta): # what is time delta 
  encode = {'sub': username, 'id': user_id} 
  expires = datetime.now(timezone.utc) + expires_delta
  encode.update({'exp': expires}) 
  return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM) 