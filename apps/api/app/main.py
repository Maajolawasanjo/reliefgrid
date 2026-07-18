from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from app.core.config import settings
from app.api.v1.router import api_router
from app.exceptions.handlers import register_exception_handlers

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    version=settings.APP_VERSION,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.on_event("startup")
def on_startup():
    try:
        from database.seeds.seed_auth import seed_initial_auth
        seed_initial_auth()
        print("✅ Startup auth seed check completed successfully.")
    except Exception as e:
        print(f"⚠️ Startup seed notice: {e}")

# CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://reliefgrid.vercel.app",
    "https://reliefgrid-production.up.railway.app",
]

if settings.CORS_ORIGINS:
    for o in settings.CORS_ORIGINS:
        if o != "*" and o not in origins:
            origins.append(str(o))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.railway\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register unified exception handlers (catches everything, no per-endpoint formatting)
register_exception_handlers(app)

app.include_router(api_router, prefix=settings.API_PREFIX)


@app.get("/")
def root():
    return {
        "message": "ReliefGrid Production API Gateway Online",
        "docs": f"{settings.API_PREFIX}/docs",
        "version": settings.APP_VERSION,
    }

