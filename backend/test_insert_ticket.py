import uuid
from models import ticket_model, transaction_model
from schema.ticket_schema import TicketCreate
import random


def test_insert_ticket():
    # step 1: buat transaksi dummy (minimal)
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
    trx_id = trx.data[0]["id"]

    names = ["Dio", "Jason", "Bram", "John", "Len"]
    
    # step 2: buat tiket pakai transaction_id valid
    dummy_ticket = TicketCreate(
        transaction_id=trx_id,
        passenger_name=names[random.randint(0, 4)],
        seat_number="A12",
        price=25000.0,
        status_id=1,
    )

    data = {
        k: (str(v) if isinstance(v, uuid.UUID) else v)
        for k, v in dummy_ticket.model_dump().items()
    }

    for i in range(4):
        response = ticket_model.create_ticket(data)
    print("Inserted ticket:", response)


if __name__ == "__main__":
    test_insert_ticket()
