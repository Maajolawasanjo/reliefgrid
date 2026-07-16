import os
import uuid
from sqlalchemy.orm import Session
from database.connection import engine, SessionLocal
from apps.api.app.models.auth import Organization, Role, User
from apps.api.app.core.security import get_password_hash

def seed_initial_auth():
    db: Session = SessionLocal()
    try:
        # 1. Create Organization
        org = db.query(Organization).filter(Organization.slug == "nema-core").first()
        if not org:
            org = Organization(
                id=str(uuid.uuid4()),
                name="National Emergency Management Agency",
                slug="nema-core"
            )
            db.add(org)
            db.commit()
            db.refresh(org)
            print("Seeded Organization: NEMA Core")

        # 2. Seed Roles
        roles_data = [
            ("ADMIN", "System Administration and Access Governance"),
            ("COORDINATOR", "Incident Command Dispatcher & Master Planner"),
            ("RESPONDER", "Field Emergency Operator")
        ]
        
        role_objs = {}
        for role_name, desc in roles_data:
            role = db.query(Role).filter(Role.name == role_name).first()
            if not role:
                role = Role(id=str(uuid.uuid4()), name=role_name, description=desc)
                db.add(role)
                db.commit()
                db.refresh(role)
                print(f"Seeded Role: {role_name}")
            role_objs[role_name] = role

        # 3. Seed Default Admin User
        admin_user = db.query(User).filter(User.email == "admin@reliefgrid.gov").first()
        if not admin_user:
            admin_user = User(
                id=str(uuid.uuid4()),
                email="admin@reliefgrid.gov",
                hashed_password=get_password_hash("AdminPassword123!"),
                full_name="ReliefGrid System Administrator",
                organization_id=org.id,
                roles=[role_objs["ADMIN"], role_objs["COORDINATOR"]]
            )
            db.add(admin_user)
            db.commit()
            print("Seeded Admin User: admin@reliefgrid.gov (Pass: AdminPassword123!)")

    finally:
        db.close()

if __name__ == "__main__":
    seed_initial_auth()
