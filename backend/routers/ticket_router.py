from fastapi import APIRouter
from schema.ticket_schema import TicketCreate, TicketResponse
from controllers import ticket_controller

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.post("/buy", response_model=TicketResponse)
def buy_ticket(ticket: TicketCreate):
    
    return ticket_controller.buy_ticket(ticket)

@router.get("/", response_model=list[TicketResponse])
def list_tickets():
    return ticket_controller.list_tickets()
