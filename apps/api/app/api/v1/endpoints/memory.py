from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from database.connection import get_db
from app.models.agent import Memory
from app.models.memory import MemoryVector
from app.services.embedding import embedding_service, cosine_similarity
from app.api.deps import get_current_user
from app.models.auth import User

router = APIRouter()

class MemorySearchRequest(BaseModel):
    query: str
    limit: int = 5

class MemorySearchResult(BaseModel):
    id: str
    incident_id: Optional[str]
    memory_type: str
    content: str
    similarity_score: float
    created_at: str

@router.post("/search", response_model=List[MemorySearchResult])
def vector_search_memories(
    payload: MemorySearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query_vector = embedding_service.generate_embedding(payload.query)
    
    # Fetch memory vectors from CockroachDB
    memory_vectors = db.query(MemoryVector).all()
    results = []

    for mv in memory_vectors:
        score = cosine_similarity(query_vector, mv.embedding.get("vec", []))
        memory = db.query(Memory).filter(Memory.id == mv.memory_id).first()
        if memory:
            results.append({
                "id": memory.id,
                "incident_id": memory.incident_id,
                "memory_type": memory.memory_type,
                "content": memory.content,
                "similarity_score": round(score, 4),
                "created_at": memory.created_at.isoformat()
            })

    # Sort by descending similarity score
    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:payload.limit]
