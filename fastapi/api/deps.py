# FILE SUMMARY 
# setting up dependencies to be used in the application for easy access 
# basically allows us to have one place to manage all dependencies 
# handles database session management 
# provides password hashing utilities 
# handles jwt token management 

from typing import Annotated
from sqlalchemy.orm import Session # lets us talk to database 
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext # hashing passwords 
from dotenv import load_dotenv
import os 
from database import SessionLocal

load_dotenv() 

SECRET_KEY = os.getenv('AUTH_SECRET_KEY') 
ALGORITHM = os.getenv('AUTH_ALGORITHM') 

def get_db(): 
  db = SessionLocal()
  try: 
    yield db 
  finally: 
    db.close() 
    
db_dependency = Annotated[Session, Depends(get_db)] # easy access to database 

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto') # allows us to hash and verify passwords 
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token') # allows us to get the token from the request 
oauth2_bearer_dependency = Annotated[str, Depends(oauth2_bearer)] # easy access to the token 


# gets current user from token 
# allows us to know which user is making the request 
# otherwise we would have to check the token for each request 
async def get_current_user(token: oauth2_bearer_dependency): 
  try: 
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    username: str = payload.get('sub')
    user_id: int = payload.get('id')
    if username is None or user_id is None: 
      raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials')
    return {'username': username, 'id': user_id} 
  except JWTError: 
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials')
  
user_dependency = Annotated[dict, Depends(get_current_user)] 
  
    