from fastapi import FastAPI, BackgroundTasks, HTTPException, Request, Depends
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from app import schemas
from app import crud
from app import models
from app.utils import perform_translation
from app.database import get_db, engine, SessionLocal
from typing import List
import uuid

# create database
models.Base.metadata.create_all(bind=engine)
app = FastAPI()

# setup Jinja2 for templates
# templates = Jinja2Templates(directory=r"app\templates")

origins = ["http://localhost:5173",
           "http://localhost"]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get('/index', tags=['index'])
async def index():
    return {
        "message": "index check"
    }


@app.post("/translate", response_model=schemas.TaskResponse, tags=['translation'])
def translate(request: schemas.TranslationRequest, background_tasks: BackgroundTasks,  db: Session = Depends(get_db)):
    task = crud.create_translation_task(db, request.text, request.languages)
    background_tasks.add_task(
        perform_translation, task.id, request.text, request.languages, db)
    return {"task_id": task.id}


@app.get("/translate/{task_id}", response_model=schemas.TranslationStatus, tags=['translation status'])
def get_translate(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_translation_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    return {"task_id": task.id, "status": task.status, "translation": task.translations}


@app.get("/translate/content/{task_id}", tags=['Translation Content'])
def get_translate_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_translation_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="task not found")
    return task
