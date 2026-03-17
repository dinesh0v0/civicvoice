from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from database import supabase
from typing import Optional
from datetime import datetime

router = APIRouter()


class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    admin_remarks: Optional[str] = None


def verify_admin(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")

    try:
        user_response = supabase.auth.get_user(token)
        if user_response.user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user_id = user_response.user.id

        profile = supabase.table("profiles") \
            .select("role") \
            .eq("id", user_id) \
            .single() \
            .execute()

        if not profile.data or profile.data.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")

        return user_id

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.get("/stats")
async def get_stats(authorization: str = Header(None)):
    verify_admin(authorization)

    try:
        result = supabase.table("complaints").select("status").execute()
        complaints = result.data or []

        total = len(complaints)
        pending = sum(1 for c in complaints if c["status"] == "pending")
        in_review = sum(1 for c in complaints if c["status"] == "in_review")
        investigating = sum(1 for c in complaints if c["status"] == "investigating")
        resolved = sum(1 for c in complaints if c["status"] == "resolved")
        rejected = sum(1 for c in complaints if c["status"] == "rejected")

        return {
            "total": total,
            "pending": pending,
            "in_review": in_review,
            "investigating": investigating,
            "resolved": resolved,
            "rejected": rejected
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/complaints")
async def get_all_complaints(authorization: str = Header(None)):
    verify_admin(authorization)

    try:
        result = supabase.table("complaints") \
            .select("*, profiles(full_name, phone)") \
            .order("created_at", desc=True) \
            .execute()

        return result.data or []

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/complaints/{complaint_id}")
async def update_complaint(complaint_id: str, req: ComplaintUpdate, authorization: str = Header(None)):
    verify_admin(authorization)

    try:
        update_data = {}
        if req.status is not None:
            update_data["status"] = req.status
        if req.priority is not None:
            update_data["priority"] = req.priority
        if req.admin_remarks is not None:
            update_data["admin_remarks"] = req.admin_remarks

        update_data["updated_at"] = datetime.utcnow().isoformat()

        result = supabase.table("complaints") \
            .update(update_data) \
            .eq("id", complaint_id) \
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Complaint not found")

        return {
            "message": "Complaint updated successfully",
            "complaint": result.data[0]
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
