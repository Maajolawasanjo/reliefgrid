import os
import uuid
from sqlalchemy.orm import Session
from database.connection import engine, SessionLocal
from app.models.auth import Organization, User, Role
from app.models.incident import Incident, IncidentTimeline, IncidentAttachment
from app.models.agent import Memory, AgentTaskPlan, AgentAssignment
from app.models.memory import MemoryVector
from app.services.embedding import embedding_service

def seed_historical_memories():
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        existing_memories = db.query(Memory).filter(Memory.memory_type == "LESSON_LEARNED").count()
        if existing_memories > 0:
            print(f"Database already contains {existing_memories} historical memories. Skipping seed.")
            return

        historical_data = [
            {
                "type": "LESSON_LEARNED",
                "content": "During Hurricane Floyd in 2025, major gridlocks were observed on Interstate 95 North due to lack of contraflow lanes. Recommended mitigation is to initiate contraflow within 6 hours of evacuation warning.",
                "metadata": {"hazard": "Hurricane", "year": 2025, "sector": "Logistics"}
            },
            {
                "type": "LESSON_LEARNED",
                "content": "In the July 2024 flash flooding event, community centers in low-lying sectors filled to capacity within 2 hours. High-elevation schools should be prioritized as secondary shelter hubs.",
                "metadata": {"hazard": "Flood", "year": 2024, "sector": "Shelter"}
            },
            {
                "type": "LESSON_LEARNED",
                "content": "During the winter storm of February 2025, backup diesel generators at Mercy Hospital failed after 18 hours of continuous operation. Stage mobile generator units within 5km of critical hospital facilities.",
                "metadata": {"hazard": "Winter Storm", "year": 2025, "sector": "Medical"}
            },
            {
                "type": "LESSON_LEARNED",
                "content": "In mountain region landslides, cellular towers lost backhaul connectivity. Satellite communication channels were the only operational link. Deploy Starlink backup kits to all regional dispatch offices.",
                "metadata": {"hazard": "Landslide", "year": 2025, "sector": "Communication"}
            },
            {
                "type": "LESSON_LEARNED",
                "content": "The tidal surge of October 2025 breached sector 4 floodgates. Frequent drone patrols are required during surges exceeding 3.5 meters to detect early structural distress.",
                "metadata": {"hazard": "Storm Surge", "year": 2025, "sector": "Infrastructure"}
            }
        ]

        print("Seeding historical memories and generating 1024-dim vector embeddings...")
        for data in historical_data:
            # 1. Save memory text record
            mem = Memory(
                id=str(uuid.uuid4()),
                memory_type=data["type"],
                content=data["content"],
                metadata_json=data["metadata"]
            )
            db.add(mem)
            db.commit()
            db.refresh(mem)

            # 2. Compute embedding vector
            vector = embedding_service.generate_embedding(data["content"])

            # 3. Save vector record
            mv = MemoryVector(
                id=str(uuid.uuid4()),
                memory_id=mem.id,
                dimension=1024,
                embedding={"vec": vector}
            )
            db.add(mv)
            db.commit()

        print("Seeding completed successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_historical_memories()
