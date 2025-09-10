from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes_auth import router as auth_router
from api.routes_payments import router as payment_router
from api.routes_tuitions import router as tuition_router
from api.routes_users import router as users_router
from core.database import engine, Base
from core.logger import logger
# import redis
from core.redis import redis_client

Base.metadata.create_all(bind=engine)

app = FastAPI()

# redis_client = redis.from_url("redis://localhost:6379", decode_responses=True)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(payment_router)
app.include_router(tuition_router)

# add cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.on_event("startup")
async def startup_event():
    redis_client.set("startup_test", "FastAPI + Redis works!")
    logger.info("🚀 Application startup complete")


@app.on_event("shutdown")
async def shutdown_event():
    await redis_client.close()
    logger.info("🛑 Application shutdown")
