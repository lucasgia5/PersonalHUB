from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import os
import logging
from datetime import datetime, date
from supabase import create_client, Client
from jose import jwt, JWTError

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

SUPABASE_URL = os.environ['SUPABASE_URL']
SUPABASE_ANON_KEY = os.environ['SUPABASE_ANON_KEY']
SUPABASE_SERVICE_KEY = os.environ['SUPABASE_SERVICE_ROLE_KEY']

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    user_id: str

class StudentCreate(BaseModel):
    name: str
    age: Optional[int] = None
    goal: Optional[str] = None
    observations: Optional[str] = None
    initial_weight: Optional[float] = None
    height: Optional[float] = None

class Student(BaseModel):
    id: str
    user_id: str
    name: str
    age: Optional[int] = None
    goal: Optional[str] = None
    observations: Optional[str] = None
    initial_weight: Optional[float] = None
    height: Optional[float] = None
    created_at: str
    updated_at: str

class WorkoutCreate(BaseModel):
    student_id: str
    name: str
    date: Optional[str] = None

class Workout(BaseModel):
    id: str
    user_id: str
    student_id: str
    name: str
    date: Optional[str] = None
    created_at: str
    updated_at: str

class ExerciseCreate(BaseModel):
    workout_id: str
    name: str
    sets: Optional[int] = None
    reps: Optional[str] = None
    weight: Optional[str] = None
    rest: Optional[str] = None

class Exercise(BaseModel):
    id: str
    user_id: str
    workout_id: str
    name: str
    sets: Optional[int] = None
    reps: Optional[str] = None
    weight: Optional[str] = None
    rest: Optional[str] = None
    created_at: str

class ExerciseHistoryCreate(BaseModel):
    exercise_id: str
    date: str
    weight: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[str] = None
    observations: Optional[str] = None

class ExerciseHistory(BaseModel):
    id: str
    user_id: str
    exercise_id: str
    date: str
    weight: Optional[str] = None
    sets: Optional[int] = None
    reps: Optional[str] = None
    observations: Optional[str] = None
    created_at: str

class CardioCreate(BaseModel):
    student_id: str
    equipment: str
    duration: Optional[int] = None
    intensity: Optional[str] = None
    observations: Optional[str] = None
    date: Optional[str] = None

class Cardio(BaseModel):
    id: str
    user_id: str
    student_id: str
    equipment: str
    duration: Optional[int] = None
    intensity: Optional[str] = None
    observations: Optional[str] = None
    date: Optional[str] = None
    created_at: str

class EvolutionCreate(BaseModel):
    student_id: str
    date: str
    current_weight: Optional[float] = None
    observations: Optional[str] = None
    performance: Optional[str] = None

class Evolution(BaseModel):
    id: str
    user_id: str
    student_id: str
    date: str
    current_weight: Optional[float] = None
    observations: Optional[str] = None
    performance: Optional[str] = None
    created_at: str

class WeeklyRoutineCreate(BaseModel):
    student_id: str
    day_of_week: int
    workout_name: str
    exercises: Optional[list] = None

class WeeklyRoutine(BaseModel):
    id: str
    user_id: str
    student_id: str
    day_of_week: int
    workout_name: str
    exercises: Optional[list] = None
    created_at: str
    updated_at: str

async def verify_token(authorization: str = Header(None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autenticação não fornecido")
    
    token = authorization.replace("Bearer ", "")
    try:
        response = supabase.auth.get_user(token)
        if not response.user:
            raise HTTPException(status_code=401, detail="Token inválido")
        return response.user.id
    except Exception as e:
        logger.error(f"Erro ao verificar token: {e}")
        raise HTTPException(status_code=401, detail="Token inválido")

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not response.session:
            raise HTTPException(status_code=401, detail="Email ou senha inválidos")
        
        return LoginResponse(
            access_token=response.session.access_token,
            user_id=response.user.id
        )
    except Exception as e:
        logger.error(f"Erro no login: {e}")
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

@api_router.post("/auth/logout")
async def logout(user_id: str = Depends(verify_token)):
    try:
        supabase.auth.sign_out()
        return {"message": "Logout realizado com sucesso"}
    except Exception as e:
        logger.error(f"Erro no logout: {e}")
        raise HTTPException(status_code=500, detail="Erro ao realizar logout")

@api_router.get("/students", response_model=List[Student])
async def get_students(user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("students").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao buscar alunos: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar alunos")

@api_router.post("/students", response_model=Student)
async def create_student(student: StudentCreate, user_id: str = Depends(verify_token)):
    try:
        data = student.model_dump()
        data["user_id"] = user_id
        response = supabase.table("students").insert(data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Erro ao criar aluno: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar aluno")

@api_router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: str, student: StudentCreate, user_id: str = Depends(verify_token)):
    try:
        data = student.model_dump()
        response = supabase.table("students").update(data).eq("id", student_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Aluno não encontrado")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar aluno: {e}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar aluno")

@api_router.delete("/students/{student_id}")
async def delete_student(student_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("students").delete().eq("id", student_id).eq("user_id", user_id).execute()
        return {"message": "Aluno excluído com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao excluir aluno: {e}")
        raise HTTPException(status_code=500, detail="Erro ao excluir aluno")

@api_router.get("/workouts", response_model=List[Workout])
async def get_workouts(student_id: Optional[str] = None, user_id: str = Depends(verify_token)):
    try:
        query = supabase.table("workouts").select("*").eq("user_id", user_id)
        if student_id:
            query = query.eq("student_id", student_id)
        response = query.order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao buscar treinos: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar treinos")

@api_router.post("/workouts", response_model=Workout)
async def create_workout(workout: WorkoutCreate, user_id: str = Depends(verify_token)):
    try:
        data = workout.model_dump()
        data["user_id"] = user_id
        response = supabase.table("workouts").insert(data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Erro ao criar treino: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar treino")

@api_router.delete("/workouts/{workout_id}")
async def delete_workout(workout_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("workouts").delete().eq("id", workout_id).eq("user_id", user_id).execute()
        return {"message": "Treino excluído com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao excluir treino: {e}")
        raise HTTPException(status_code=500, detail="Erro ao excluir treino")

@api_router.get("/exercises", response_model=List[Exercise])
async def get_exercises(workout_id: Optional[str] = None, user_id: str = Depends(verify_token)):
    try:
        query = supabase.table("exercises").select("*").eq("user_id", user_id)
        if workout_id:
            query = query.eq("workout_id", workout_id)
        response = query.order("created_at").execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao buscar exercícios: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar exercícios")

@api_router.post("/exercises", response_model=Exercise)
async def create_exercise(exercise: ExerciseCreate, user_id: str = Depends(verify_token)):
    try:
        data = exercise.model_dump()
        data["user_id"] = user_id
        response = supabase.table("exercises").insert(data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Erro ao criar exercício: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar exercício")

@api_router.put("/exercises/{exercise_id}", response_model=Exercise)
async def update_exercise(exercise_id: str, exercise: ExerciseCreate, user_id: str = Depends(verify_token)):
    try:
        data = exercise.model_dump()
        response = supabase.table("exercises").update(data).eq("id", exercise_id).eq("user_id", user_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Exercício não encontrado")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao atualizar exercício: {e}")
        raise HTTPException(status_code=500, detail="Erro ao atualizar exercício")

@api_router.delete("/exercises/{exercise_id}")
async def delete_exercise(exercise_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("exercises").delete().eq("id", exercise_id).eq("user_id", user_id).execute()
        return {"message": "Exercício excluído com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao excluir exercício: {e}")
        raise HTTPException(status_code=500, detail="Erro ao excluir exercício")

@api_router.get("/exercise-history", response_model=List[ExerciseHistory])
async def get_exercise_history(exercise_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("exercise_history").select("*").eq("exercise_id", exercise_id).eq("user_id", user_id).order("date", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao buscar histórico: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar histórico")

@api_router.post("/exercise-history", response_model=ExerciseHistory)
async def create_exercise_history(history: ExerciseHistoryCreate, user_id: str = Depends(verify_token)):
    try:
        data = history.model_dump()
        data["user_id"] = user_id
        response = supabase.table("exercise_history").insert(data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Erro ao criar registro de histórico: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar registro de histórico")

@api_router.get("/cardio", response_model=List[Cardio])
async def get_cardio(student_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("cardio").select("*").eq("student_id", student_id).eq("user_id", user_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao buscar cardio: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar cardio")

@api_router.post("/cardio", response_model=Cardio)
async def create_cardio(cardio: CardioCreate, user_id: str = Depends(verify_token)):
    try:
        data = cardio.model_dump()
        data["user_id"] = user_id
        response = supabase.table("cardio").insert(data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Erro ao criar cardio: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar cardio")

@api_router.delete("/cardio/{cardio_id}")
async def delete_cardio(cardio_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("cardio").delete().eq("id", cardio_id).eq("user_id", user_id).execute()
        return {"message": "Cardio excluído com sucesso"}
    except Exception as e:
        logger.error(f"Erro ao excluir cardio: {e}")
        raise HTTPException(status_code=500, detail="Erro ao excluir cardio")

@api_router.get("/evolution", response_model=List[Evolution])
async def get_evolution(student_id: str, user_id: str = Depends(verify_token)):
    try:
        response = supabase.table("evolution").select("*").eq("student_id", student_id).eq("user_id", user_id).order("date", desc=True).execute()
        return response.data
    except Exception as e:
        logger.error(f"Erro ao buscar evolução: {e}")
        raise HTTPException(status_code=500, detail="Erro ao buscar evolução")

@api_router.post("/evolution", response_model=Evolution)
async def create_evolution(evolution: EvolutionCreate, user_id: str = Depends(verify_token)):
    try:
        data = evolution.model_dump()
        data["user_id"] = user_id
        response = supabase.table("evolution").insert(data).execute()
        return response.data[0]
    except Exception as e:
        logger.error(f"Erro ao criar evolução: {e}")
        raise HTTPException(status_code=500, detail="Erro ao criar evolução")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
