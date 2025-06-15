from sqlalchemy.orm import Session
from fastapi import HTTPException
from src.user.model.user import User
from src.user.model.user import CreateUserRequest, UserCreateOutput

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str):
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_id(self, id: int):
        return self.db.query(User).filter(User.id == id).first()

    def get_users(self, skip: int = 0, limit: int = 10):
        return self.db.query(User).offset(skip).limit(limit).all()

    def delete_user(self, id: int):
        user = self.get_user_by_id(id)
        if user:
            self.db.delete(user)
            self.db.commit()
        return user

    def create_user(self, user: CreateUserRequest):
        new_user = User(email=user.email,
                       password=user.password,
                       firstname= user.firstname,
                       lastname=user.lastname)
        
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)

        user_output = UserCreateOutput(
            email=user.email,
            firstname=user.firstname,
            lastname=user.lastname
        )
        return user_output