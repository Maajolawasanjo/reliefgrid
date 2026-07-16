"""Collective Memory Vector Store Schema

Revision ID: 2026_07_16_0004
Revises: 2026_07_16_0003
Create Date: 2026-07-16 09:45:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '2026_07_16_0004'
down_revision = '2026_07_16_0003'
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.create_table(
        'memory_vectors',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('memory_id', sa.String(length=36), nullable=False),
        sa.Column('dimension', sa.Integer(), server_default='1024', nullable=False),
        sa.Column('embedding', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['memory_id'], ['memories.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('memory_vectors')
