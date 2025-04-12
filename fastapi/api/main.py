# FILE SUMMARY 
# entry point of the application 
# sets up fast api application 
# creates database tables 
# configures CORS for frontend communication 
# including authentication routes 
# provides health check endpoint 

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import auth, workouts 

app = FastAPI() 

# looks at all the models in the classes and creates the tables in the database 

Base.metadata.create_all(bind=engine) 
app.add_middleware(
  CORSMiddleware, 
  allow_origins=['http://localhost:3000'],
  allow_credentials=True,
  allow_methods=['*'],
  allow_headers=['*']
)

@app.get("/")
def health_check(): 
  return 'Health check completed'

app.include_router(auth.router) 
app.include_router(workouts.router) 



