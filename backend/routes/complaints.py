from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from database import supabase
from typing import Optional
from datetime import datetime
import random

router = APIRouter()


class ComplaintCreate(BaseModel):
    category: str
    subject: str
    description: str
    location: Optional[str] = None


def generate_tracking_id():
    year = datetime.now().year
    num = random.randint(10000, 99999)
    return f"CMP-{year}-{num}"


def get_user_id(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")

    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_response.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("")
async def create_complaint(req: ComplaintCreate, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    try:
        tracking_id = generate_tracking_id()

        result = supabase.table("complaints").insert({
            "user_id": user_id,
            "tracking_id": tracking_id,
            "category": req.category,
            "subject": req.subject,
            "description": req.description,
            "location": req.location or "",
            "status": "pending",
            "priority": "medium"
        }).execute()

        return {
            "message": "Complaint submitted successfully",
            "complaint": result.data[0] if result.data else None,
            "tracking_id": tracking_id
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("")
async def get_my_complaints(authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    try:
        result = supabase.table("complaints") \
            .select("*") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .execute()

        return result.data or []

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/track/{tracking_id}")
async def track_complaint(tracking_id: str):
    try:
        result = supabase.table("complaints") \
            .select("id, tracking_id, category, subject, status, priority, admin_remarks, created_at, updated_at") \
            .eq("tracking_id", tracking_id.upper()) \
            .single() \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Complaint not found")

        return result.data

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Complaint not found")


@router.get("/{complaint_id}")
async def get_complaint(complaint_id: str, authorization: str = Header(None)):
    user_id = get_user_id(authorization)

    try:
        result = supabase.table("complaints") \
            .select("*") \
            .eq("id", complaint_id) \
            .eq("user_id", user_id) \
            .single() \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Complaint not found")

        return result.data

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=404, detail="Complaint not found")
