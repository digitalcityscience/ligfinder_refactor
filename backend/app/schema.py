from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class TableNamePayload(BaseModel):
    tablename: str


class FeatureIdPayload(BaseModel):
    tablename: str
    featureid: int


class PostBase(BaseModel):
    title: str
    content: str
    published: bool = True


class CreatePost(PostBase):
    pass


class UpdatePost(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    published: Optional[bool] = None
    # rating: Optional[int] = None

    def model_dump(self):
        return {k: v for k, v in self.model_dump().items() if v is not None}


class ResponsePost(PostBase):
    # inheretiance from PostBase
    id: int
    create_at: datetime
    owner_id: int

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    create_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[int] = None
