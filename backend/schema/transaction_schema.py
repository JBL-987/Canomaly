from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class TransactionBase(BaseModel):
    user_id: UUID
    origin_id: int
    station_from_id: int
    station_to_id: int
    total_amount: float
    payment_method_id: int
    booking_channel_id: int
    status_id: int
    device_fingerprint: str | None = None
    ip_address: str | None = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
