from schema.ticket_schema import TicketCreate, TicketResponse
from models import ticket_model
from services.model_service import model
import numpy as np
import uuid
from datetime import datetime
from models import transaction_model
import random


def generate_dummy_ip():
    return f"192.168.{random.randint(0, 255)}.{random.randint(1, 254)}"


def parse_datetime(value) -> datetime:
    """
    Parse datetime string to datetime object.
    Accepts string in ISO format (YYYY-MM-DDTHH:MM:SS) or datetime directly.
    """
    if value is None:
        return None

    if isinstance(value, datetime):
        return value

    try:
        return datetime.fromisoformat(value)
    except Exception:
        # fallback kalau format tidak sesuai
        try:
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        except Exception:
            raise ValueError(f"Invalid datetime format: {value}")


def hash_string_to_int(value: str) -> int:
    """
    Convert string (e.g., device_id, ip_id) to stable integer.
    """
    if value is None:
        return 0
    return abs(hash(str(value))) % (10**6)


def safe_int(value: str) -> int:
    """
    Convert string category into a stable int.
    If value already numeric, return as int.
    If string, hash it into a consistent int.
    """
    if value is None:
        return 0
    try:
        return int(value)
    except ValueError:
        # pakai hash, modulus biar tidak terlalu besar
        return abs(hash(value)) % (10**6)


def ticket_to_numeric_array(ticket: TicketCreate) -> np.ndarray:
    t_time = parse_datetime(ticket.transaction_time)

    # turunan feature dari waktu
    hour = t_time.hour
    day_of_week = t_time.weekday()  # 0 = Senin
    is_weekend = 1 if day_of_week >= 5 else 0
    is_night = 1 if hour < 6 or hour >= 22 else 0
    is_peak_hour = 1 if hour in [7, 8, 17, 18] else 0

    # feature turunan lain
    price_per_ticket = float(ticket.price) / max(ticket.num_tickets, 1)

    arr = [
        float(ticket.price),  # 1 price
        int(ticket.num_tickets),  # 2 num_tickets
        int(ticket.station_from_id),  # 3 station_from_id
        int(ticket.station_to_id),  # 4 station_to_id
        int(ticket.payment_method_id),  # 5 payment_method_id
        int(ticket.booking_channel_id),  # 6 booking_channel_id
        int(ticket.is_refund),  # 7 is_refund
        hour,  # 8 hour
        day_of_week,  # 9 day_of_week
        is_weekend,  # 10 is_weekend
        is_night,  # 11 is_night
        is_peak_hour,  # 12 is_peak_hour
        price_per_ticket,  # 13 price_per_ticket
        int(ticket.is_popular_route),  # 14 is_popular_route
        safe_int(ticket.price_category),  # 15 price_category (str → int/hash)
        safe_int(ticket.tickets_category),  # 16 tickets_category (str → int/hash)
        hash_string_to_int(ticket.device_id),  # 17 device_id
        hash_string_to_int(ticket.ip_id),  # 18 ip_id
    ]

    return np.array([arr], dtype=float)


def buy_ticket(ticket: TicketCreate) -> TicketResponse:
    """
    Analisis transaksi tiket untuk deteksi anomali + insert ke Supabase
    """
    # --- Step 1: convert ticket ke array numeric buat prediksi ---
    X = ticket_to_numeric_array(ticket)

    pred = model.predict(X)[0]  # -1 = anomaly, 1 = normal
    score = model.score_samples(X)[0]

    # Map prediksi ke anomaly label id (misal 1 = normal, 2 = anomaly)
    anomaly_label_id = 1 if pred == 1 else 2

    # --- Step 2: Insert ke transactions table ---
    trx_data = {
        "user_id": str(ticket.user_id),
        "origin_id": 1,  # nanti bisa dihubungkan dengan station
        "station_from_id": ticket.station_from_id,
        "station_to_id": ticket.station_to_id,
        "total_amount": float(ticket.price),
        "payment_method_id": ticket.payment_method_id,
        "booking_channel_id": ticket.booking_channel_id,
        "status_id": 1,  # default booked
        "device_fingerprint": ticket.device_id,
        "ip_address": generate_dummy_ip(),
        "is_refund": bool(ticket.is_refund),
        "anomaly_score": float(score),
        "anomaly_label_id": anomaly_label_id,
        "fraud_flag": True if pred == -1 else False,
    }

    trx = transaction_model.create_transaction(trx_data)
    trx_id = trx.data[0]["id"]

    # --- Step 3: Insert ke tickets (detail per penumpang) ---
    inserted_tickets = []
    for idx, seat in enumerate(ticket.seat_number):
        ticket_data = {
            "transaction_id": str(trx_id),
            "passenger_name": (
                ticket.passenger_name
                if idx == 0
                else f"{ticket.passenger_name} {idx+1}"
            ),
            "seat_number": seat,
            "price": float(ticket.price / ticket.num_tickets),
            "status_id": 1,  # default booked
        }
        res = ticket_model.create_ticket(ticket_data)
        inserted_tickets.append(res)

    # --- Step 4: Return schema TicketResponse ---
    return TicketResponse(
        id=uuid.uuid4(),
        transaction_id=ticket.transaction_id,
        user_id=ticket.user_id,
        price=ticket.price,
        num_tickets=ticket.num_tickets,
        station_from_id=ticket.station_from_id,
        station_to_id=ticket.station_to_id,
        payment_method_id=ticket.payment_method_id,
        booking_channel_id=ticket.booking_channel_id,
        is_refund=ticket.is_refund,
        transaction_time=datetime.now(),
        created_at=datetime.now(),
        prediction="anomaly" if pred == -1 else "normal",
        score=score,
    )


def buy_ticket_auto(ticket: TicketCreate) -> dict:
    """
    Buat ticket tanpa analisis anomaly
    """
    ticket_model.create_ticket(ticket)
    return {"message": "Ticket created"}


def list_tickets() -> list[TicketResponse]:
    """
    Ambil semua tiket dari database
    """
    response = ticket_model.get_tickets()
    return response.data
