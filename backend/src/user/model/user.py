from sqlalchemy import Column, Integer, String
from src.database import Base
from pydantic import BaseModel, EmailStr


class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    password = Column(String, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)


class CreateUserRequest(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str
    firstname: str
    lastname: str
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True,
        "json_schema_extra": {
            "examples": [
                {
                    "email": "example@example.com",
                    "password": "123456789",
                    "confirm_password": "123456789",
                    "firstname": "Jhon",
                    "lastname": "Doe"
                },
            ]
        }
    }

class UserCreateOutput(BaseModel):
    email: EmailStr
    firstname: str
    lastname: str
    model_config = {
        "from_attributes": True,
        "arbitrary_types_allowed": True,
    }