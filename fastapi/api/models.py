# FILE SUMMARY 
# defines the database structures of user, workout, routine, 
# also defines workout_routine_association which links the workout and routine tables 

from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship 
from database import Base 

workout_routine_association = Table (
  'workout_routine', Base.metadata,  # name of the table 
  Column('workout_id', Integer, ForeignKey('workouts.id')), #links to workout table 
  Column('routine_id', Integer, ForeignKey('routines.id')) # links to routine table 
)

class User(Base): 
  __tablename__ = 'users'
  id = Column(Integer, primary_key=True, index=True)
  username = Column(String, unique=True, index=True)
  hashed_password = Column(String) 
  
class Workout(Base):
  __tablename__ = 'workouts' 
  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'))
  name = Column(String, index=True)
  description = Column(String, index=True) 
  routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')
  
class Routine(Base): 
  __tablename__ = 'routines' 
  id = Column(Integer, primary_key=True, index=True)
  user_id = Column(Integer, ForeignKey('users.id'))
  name = Column(String, index=True)
  description = Column(String, index=True) 
  workouts = relationship('Workout', secondary=workout_routine_association, back_populates='routines')

# secondary: This points to the association table (workout_routine_association) that connects workouts and routines
# back_populates: This tells SQLAlchemy that changes to one side of the relationship should be reflected on the other side
Workout.routines = relationship('Routine', secondary=workout_routine_association, back_populates='workouts')
