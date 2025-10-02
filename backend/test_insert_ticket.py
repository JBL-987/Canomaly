import uuid
from models import ticket_model, transaction_model
from schema.ticket_schema import TicketCreate
import random

def test_insert_ticket():
    # Step 1: buat transaksi dummy (minimal)
    dummy_transaction = {
        "user_id": "af5b6461-abea-4668-a5e9-58811a2f4e9e",
        "origin_id": 1,
        "station_from_id": 1,
        "station_to_id": 2,
        "total_amount": 25000.0,
        "payment_method_id": 1,
        "booking_channel_id": 1,
        "status_id": 1,
    }

    trx = transaction_model.create_transaction(dummy_transaction)
    trx_id = trx.data[0]["id"]  # pastikan trx.data berisi list/dict

    names = ["Dio", "Jason", "Bram", "John", "Len"]
    seat_letters = ["A", "B", "C", "D"]
    
    inserted_tickets = []

    # Step 2: buat dan insert 4 tiket dummy
    for i in range(4):
        dummy_ticket = TicketCreate(
            transaction_id=str(trx_id),  # pastikan UUID jadi string
            passenger_name=random.choice(names),
            seat_number=f"{random.choice(seat_letters)}{random.randint(1,20)}",
            price=25000.0,
            status_id=1,
        )

        # Convert ke dict & pastikan UUID jadi string
        data = {
            k: (str(v) if isinstance(v, uuid.UUID) else v)
            for k, v in dummy_ticket.model_dump().items()
        }

        response = ticket_model.create_ticket(data)
        inserted_tickets.append(response)

    print("Inserted tickets:")
    for t in inserted_tickets:
        print(t)

if __name__ == "__main__":
    test_insert_ticket()
