from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "ReliefGrid"
    APP_ENV: str = "development"
    APP_VERSION: str = "1.0.0"
    DEBUG_MODE: bool = True
    
    API_PREFIX: str = "/api/v1"
    CORS_ORIGINS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://reliefgrid_admin:9_P54mhucBO38GU69MwZNw@prize-lizard-29433.j77.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full"
    DATABASE_POOL_SIZE: int = 10
    DATABASE_MAX_OVERFLOW: int = 20
    
    # Authentication & Cryptography
    JWT_SECRET_KEY: str = "dev_insecure_jwt_secret_key_never_use_in_production_12345"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # AWS & Bedrock
    AWS_REGION: str = "us-east-1"
    BEDROCK_MODEL_ID: str = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    BEDROCK_EMBEDDING_MODEL_ID: str = "cohere.embed-english-v3"

    # GIS & Geospatial Integrations
    OVERPASS_URL: str = "https://overpass-api.de/api/interpreter"
    OSRM_ROUTE_URL: str = "https://router.project-osrm.org/route/v1"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
