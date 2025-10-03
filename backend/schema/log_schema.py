from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class TransactionLogBase(BaseModel):
    transaction_id: UUID
    status_id: int
    action: str
    changed_by: UUID | None = None

class TransactionLogCreate(TransactionLogBase):
    pass

class TransactionLogResponse(TransactionLogBase):
    id: int
    changed_at: datetime
