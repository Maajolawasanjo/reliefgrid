"""Production Performance Index Optimization

Revision ID: 2026_07_16_0005
Revises: 2026_07_16_0004
Create Date: 2026-07-16 09:50:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '2026_07_16_0005'
down_revision = '2026_07_16_0004'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_index('idx_incidents_org_status', 'incidents', ['organization_id', 'status'])
    op.create_index('idx_incidents_org_severity', 'incidents', ['organization_id', 'severity'])
    op.create_index('idx_audit_logs_timestamp', 'audit_logs', ['timestamp'])
    op.create_index('idx_memories_incident_type', 'memories', ['incident_id', 'memory_type'])
    op.create_index('idx_assignments_incident_status', 'agent_assignments', ['incident_id', 'status'])

def downgrade() -> None:
    op.drop_index('idx_assignments_incident_status', table_name='agent_assignments')
    op.drop_index('idx_memories_incident_type', table_name='memories')
    op.drop_index('idx_audit_logs_timestamp', table_name='audit_logs')
    op.drop_index('idx_incidents_org_severity', table_name='incidents')
    op.drop_index('idx_incidents_org_status', table_name='incidents')
