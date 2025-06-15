from fastapi import APIRouter, Depends
from src.user.model.user import CreateUserRequest, UserCreateOutput
from src.auth.model.model import LoginRequest
from src.auth.service.service import register_user, login_user
from sqlalchemy.orm import Session
from src.database import get_db
router = APIRouter(
    prefix="/auth",
    tags=["Auth"])

@router.post("/register", response_model=UserCreateOutput)
def register(user: CreateUserRequest, db: Session = Depends(get_db)):
    user_created = register_user(user, db)
    return user_created


@router.post("/login", response_model=UserCreateOutput)
def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    return login_user(login_request, db)