from schema.ticket_schema import TicketCreate, TicketResponse
from models import ticket_model

def buy_ticket(ticket: TicketCreate) -> TicketResponse:
    # misal tambahin logic cek harga, seat, dll
    response = ticket_model.create_ticket(ticket.dict())
    return response.data[0]

def list_tickets() -> list[TicketResponse]:
    response = ticket_model.get_tickets()
    return response.data
