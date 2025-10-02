from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional  # <-- tambahkan ini

class TicketBase(BaseModel):
    transaction_id: UUID
    passenger_name: str
    seat_number: str | None = None
    price: float
    status_id: int
    model_config = ConfigDict(
        json_encoders={UUID: str}  # otomatis konversi UUID ke string
    )

class TicketCreate(BaseModel):
    transaction_id: UUID
    passenger_name: str
    seat_number: str | None = None
    price: float
    status_id: int

class TicketResponse(TicketCreate):
    id: UUID
    created_at: datetime
