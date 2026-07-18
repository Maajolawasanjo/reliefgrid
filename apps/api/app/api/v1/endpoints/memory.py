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

class MemoryCreate(BaseModel):

    memory_type: str
    content: str
    incident_id: Optional[str] = None
    metadata_json: Optional[Dict[str, Any]] = None

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_memory(
    payload: MemoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    import uuid
    mem = Memory(
        id=str(uuid.uuid4()),
        incident_id=payload.incident_id,
        memory_type=payload.memory_type,
        content=payload.content,
        metadata_json=payload.metadata_json or {"source": "manual_entry", "author": current_user.email}
    )
    db.add(mem)
    db.flush()

    vector = embedding_service.generate_embedding(payload.content)
    mv = MemoryVector(
        id=str(uuid.uuid4()),
        memory_id=mem.id,
        dimension=len(vector),
        embedding={"vec": vector}
    )
    db.add(mv)
    db.commit()
    db.refresh(mem)
    return {
        "id": mem.id,
        "memory_type": mem.memory_type,
        "content": mem.content,
        "incident_id": mem.incident_id,
        "created_at": mem.created_at.isoformat()
    }

@router.get("/")
def list_memories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    memories = db.query(Memory).order_by(Memory.created_at.desc()).limit(50).all()
    results = []
    for m in memories:
        results.append({
            "id": m.id,
            "incident_id": m.incident_id,
            "memory_type": m.memory_type,
            "content": m.content,
            "similarity_score": 1.0,
            "metadata": m.metadata_json or {},
            "created_at": m.created_at.isoformat()
        })
    return results

@router.delete("/{memory_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_memory(
    memory_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    mem = db.query(Memory).filter(Memory.id == memory_id).first()
    if not mem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory not found")
    
    db.query(MemoryVector).filter(MemoryVector.memory_id == memory_id).delete()
    db.delete(mem)
    db.commit()
    return None

