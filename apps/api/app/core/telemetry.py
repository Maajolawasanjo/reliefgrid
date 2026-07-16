import uuid
from contextvars import ContextVar
from typing import Optional

correlation_id_ctx: ContextVar[Optional[str]] = ContextVar("correlation_id_ctx", default=None)

def get_correlation_id() -> str:
    cid = correlation_id_ctx.get()
    if not cid:
        cid = str(uuid.uuid4())
        correlation_id_ctx.set(cid)
    return cid
