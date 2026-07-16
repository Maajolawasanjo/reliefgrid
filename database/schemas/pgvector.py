from sqlalchemy import text
from database.connection import engine

def enable_vector_extension():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()
