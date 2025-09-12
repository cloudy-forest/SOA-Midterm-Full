from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

import models
from core.database import get_db
from dependencies import get_current_user

router = APIRouter(prefix="/users", tags =["Users"])

@router.get("/me")
async def get_user(current_user : models.User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "phone": current_user.phone,
        "fullname": current_user.fullname,
        "address": current_user.address,
        "available_balance": current_user.available_balance,
        "role": current_user.role.value,
        "username": current_user.username,
        "studentId": current_user.id
    }



# 2.change password










