from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.complaints import router as complaints_router
from routes.admin import router as admin_router

app = FastAPI(
    title="CivicVoice API",
    description="Backend API for the Online Complaint Management System",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(complaints_router, prefix="/api/complaints", tags=["complaints"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])


@app.get("/")
async def root():
    return {"message": "CivicVoice API is running", "version": "1.0.0"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}
