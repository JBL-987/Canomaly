from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class TicketBase(BaseModel):
    transaction_id: UUID
    user_id: str | int
    price: float
    num_tickets: int
    station_from_id: int
    station_to_id: int
    payment_method_id: int
    booking_channel_id: int
    is_refund: int
    transaction_time: datetime

    # Feature engineered fields
    hour: Optional[int] = None
    day_of_week: Optional[int] = None
    is_weekend: Optional[int] = None
    is_night: Optional[int] = None
    is_peak_hour: Optional[int] = None
    price_per_ticket: Optional[float] = None
    is_popular_route: Optional[int] = None
    price_category: Optional[int] = None   # ⬅️ int kategori harga
    tickets_category: Optional[int] = None # ⬅️ int kategori tiket
    device_id: Optional[str] = None
    ip_id: Optional[str] = None

    # Tambahan data penumpang
    passenger_name: Optional[str] = None
    seat_number: Optional[List[str]] = None

    model_config = ConfigDict(
        json_encoders={UUID: str}  # otomatis konversi UUID ke string
    )


class TicketCreate(TicketBase):
    """
    Schema untuk create ticket (input)
    """
    pass


class TicketResponse(TicketBase):
    """
    Schema untuk response ticket (output)
    """
    id: UUID
    created_at: datetime
    prediction: str
    score: float
