from fastapi import FastAPI, Form, BackgroundTasks
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from generator import create_fastapi_project
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def remove_temp_file(path: str):
    """Deletes a file from the filesystem."""
    try:
        os.remove(path)
        print(f"Cleanup: removed {path}")
    except Exception as e:
        print(f"Cleanup error: {e}")

@app.get("/", response_class=HTMLResponse)
def home():
    with open("templates/index.html") as f:
        return f.read()

@app.post("/generate")
def generate(background_tasks: BackgroundTasks, project_name: str = Form(...)):
    zip_file_path = create_fastapi_project(project_name)
    
    # Schedule the file to be removed after the response is sent
    background_tasks.add_task(remove_temp_file, zip_file_path)
    
    return FileResponse(
        path=zip_file_path, 
        filename=f"{project_name}.zip", 
        media_type='application/zip'
    )
