from fastapi import FastAPI
from pydantic import BaseModel
from database import insertion, get_all_passwords, delete, update
from typing import Optional
import bcrypt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PasswordEntry(BaseModel):
    website: str
    url: str
    password: str
    email: str

class updatePassword(BaseModel):
    website: Optional[str] = None
    url: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None

def password_hashing(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt())
    return hashed.decode()
    

@app.get("/")
def root():
    return {"message": "hello world"}

@app.post("/passwords")
def password(entry: PasswordEntry):
    hashed_password = password_hashing(entry.password)
    insertion(website = entry.website, url = entry.url, password_hashed = hashed_password, email = entry.email)
    return {"status": "added"}


@app.get("/passwords")
def list_passwords():
    return get_all_passwords()

@app.delete("/passwords/{id}")
def remove_password(id: int):
    delete(id)
    return {"status": "deleted"}

@app.put("/passwords/{id}")
def update_password(id: int, entry: updatePassword):
    hashed_password = password_hashing(entry.password) if entry.password is not None else None
    update(id = id, website = entry.website, url = entry.url, password_hashed = hashed_password, email = entry.email)
    return {"status": "updated"}