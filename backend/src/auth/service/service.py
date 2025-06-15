from fastapi import HTTPException
from src.user.model.user import CreateUserRequest
from src.user.service.service import UserService  # tu clase UserService
from src.utils import hash_password, verify_password
from src.auth.model.model import LoginRequest
from sqlalchemy.orm import Session
from src.auth.deps.deps import create_access_token

def register_user(user: CreateUserRequest, db: Session):
    user_service = UserService(db)

    if user_service.get_user_by_email(user.email):
        raise HTTPException(status_code=403, detail="Email already exists")

    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    user.password = hash_password(user.password)
    return user_service.create_user(user)

def login_user(login_request: LoginRequest, db: Session):
    user_service = UserService(db)

    user_data = user_service.get_user_by_email(login_request.email)

    if user_data is None:
        raise HTTPException(status_code=401, detail="Passwords do not match or Invalid credentials")

    if not verify_password(login_request.password, user_data.password):
        raise HTTPException(status_code=401, detail="Passwords do not match or Invalid credentials")

    payload = {
        "sub": str(user_data.id),  # "sub" es un claim estándar que indica el subject (usuario)
        "user": {
            "email": user_data.email,
            "firstname": user_data.firstname,
            "lastname": user_data.lastname
        }
    }
    token = create_access_token(payload)
    return {
        "user": payload["user"],
        "access_token": token,
        "token_type": "bearer"
    }