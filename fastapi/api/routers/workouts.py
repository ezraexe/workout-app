from pydantic import BaseModel
from typing import Optional 
from fastapi import APIRouter, Depends, HTTPException, status 
from models import Workout, User 
from deps import db_dependency, user_dependency

router = APIRouter(
  prefix='/workouts', 
  tags=['workouts']
)

class WorkoutBase(BaseModel): 
  name: str
  description: Optional[str] = None
  
# just inherits everything from the base model 
class WorkoutCreate(WorkoutBase): 
  pass

@router.get('/')
def get_workout(db: db_dependency, user: user_dependency, workout_id: int): 
  return db.query(Workout).filter(Workout.id == workout_id).first()

# @router.get('/{workout_id}')
# def get_workout(db: db_dependency, user: user_dependency, workout_id: int): 
#   workout_model = db.query(Workout).filter(Workout.id == workout_id).first()
#   if workout_model != None: 
#     return workout_model 
#   raise HTTPException(status_code=404, detail='Workout not found')

@router.get('/workouts')
def get_workouts(db: db_dependency, user: user_dependency): 
  return db.query(Workout).all()

@router.post('/', status_code=status.HTTP_201_CREATED)
def create_workout(db: db_dependency, user: user_dependency, workout_create: WorkoutCreate): 
  db_workout = Workout(**workout_create.model_dump(), user_id=user.get('id')) # go over this 
  db.add(db_workout)
  db.commit()
  db.refresh(db_workout) # go over this 
  return db_workout

@router.delete('/')
def delete_workout(db: db_dependency, user: user_dependency, workout_id: int): 
  db_workout = db.query(Workout).filter(Workout.id == workout_id).first() 
  if db_workout is None: 
    raise HTTPException(status_code=404, detail='Workout not found')
  db.delete(db_workout) 
  db.commit() 
  return db_workout 