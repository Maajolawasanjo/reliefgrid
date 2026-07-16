"""AI Multi-Agent and Memory Schemas

Revision ID: 2026_07_16_0003
Revises: 2026_07_16_0002
Create Date: 2026-07-16 09:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '2026_07_16_0003'
down_revision = '2026_07_16_0002'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'memories',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('incident_id', sa.String(length=36), nullable=True),
        sa.Column('memory_type', sa.String(length=50), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['incident_id'], ['incidents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'agent_task_plans',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('incident_id', sa.String(length=36), nullable=False),
        sa.Column('plan_summary', sa.Text(), nullable=False),
        sa.Column('subtasks_json', sa.JSON(), nullable=False),
        sa.Column('status', sa.String(length=20), server_default='GENERATED', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['incident_id'], ['incidents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'agent_assignments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('incident_id', sa.String(length=36), nullable=False),
        sa.Column('task_plan_id', sa.String(length=36), nullable=False),
        sa.Column('agent_name', sa.String(length=50), nullable=False),
        sa.Column('instruction', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=20), server_default='DISPATCHED', nullable=False),
        sa.Column('result_summary', sa.Text(), nullable=True),
        sa.Column('assigned_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['incident_id'], ['incidents.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['task_plan_id'], ['agent_task_plans.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('agent_assignments')
    op.drop_table('agent_task_plans')
    op.drop_table('memories')
