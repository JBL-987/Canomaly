from pydantic import BaseModel, ConfigDict, Field
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

    # Ticket class untuk price validation
    ticket_class_id: Optional[int] = Field(
        default=1, 
        ge=1, 
        le=3, 
        description="1=Ekonomi, 2=Bisnis, 3=Eksekutif"
    )
    discount_amount: Optional[float] = Field(
        default=0, 
        ge=0, 
        description="Discount amount in Rupiah"
    )

    # Feature engineered fields
    hour: Optional[int] = None
    day_of_week: Optional[int] = None
    is_weekend: Optional[int] = None
    is_night: Optional[int] = None
    is_peak_hour: Optional[int] = None
    price_per_ticket: Optional[float] = None
    is_popular_route: Optional[int] = None
    price_category: Optional[int] = None
    tickets_category: Optional[int] = None
    device_id: Optional[str] = None
    ip_id: Optional[str] = None

    # Data penumpang
    passenger_name: Optional[List[str]] = None
    seat_number: Optional[List[str]] = None

    model_config = ConfigDict(
        json_encoders={UUID: str}
    )


class TicketCreate(TicketBase):
    """Schema untuk create ticket (input)"""
    pass


class TicketResponse(TicketBase):
    """Schema untuk response ticket (output)"""
    id: UUID
    created_at: datetime
    
    # Model prediction results
    prediction: str
    score: float
    risk_score: Optional[float] = None
    risk_level: Optional[str] = None
    is_scalper: Optional[bool] = None
    
    # Price validation
    price_validation: Optional[dict] = None
    
    # Model features
    model_features: Optional[dict] = None