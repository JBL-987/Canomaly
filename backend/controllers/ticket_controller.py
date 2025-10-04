from schema.ticket_schema import TicketCreate, TicketResponse
from models import ticket_model, transaction_model
from services.model_service import api_detector
from config.supabase import supabase
import uuid
from datetime import datetime
import hashlib
import random

# Configuration
TICKET_CLASSES = {
    1: {'name': 'Economy', 'min': 80000, 'max': 140000, 'base': 100000},
    2: {'name': 'Business', 'min': 150000, 'max': 150000, 'base': 150000},
    3: {'name': 'Executive', 'min': 250000, 'max': 350000, 'base': 300000}
}

# ---------------- Helper Functions ---------------- #

def generate_dummy_ip() -> str:
    return f"192.168.{random.randint(0, 255)}.{random.randint(1, 254)}"


def parse_datetime(value) -> datetime:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    try:
        return datetime.fromisoformat(value)
    except Exception:
        try:
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
        except Exception:
            raise ValueError(f"Invalid datetime format: {value}")
<<<<<<< HEAD
        
=======

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
def ensure_uuid(user_id: str) -> str:
    """
    Convert any string into a valid UUID string.
    - Jika sudah UUID, tetap dipakai.
    - Jika bukan UUID, generate deterministic UUID dari MD5 hash.
    """
    try:
        return str(uuid.UUID(str(user_id)))
    except ValueError:
        md5_hash = hashlib.md5(str(user_id).encode()).hexdigest()
        uuid_str = f"{md5_hash[:8]}-{md5_hash[8:12]}-{md5_hash[12:16]}-{md5_hash[16:20]}-{md5_hash[20:32]}"
        return str(uuid.UUID(uuid_str))


def calculate_ticket_features(ticket: TicketCreate) -> dict:
    """
    Calculate 14 features untuk model dari ticket data.
    """
    # Get ticket class info
    ticket_class_id = getattr(ticket, 'ticket_class_id', 1)
    class_info = TICKET_CLASSES.get(ticket_class_id, TICKET_CLASSES[1])
<<<<<<< HEAD
    
    final_price = float(ticket.price)
    base_price = class_info['base']
    max_price = class_info['max']
    discount_amount = float(getattr(ticket, 'discount_amount', 0))
    
    # Calculate derived features
    price_markup_ratio = final_price / base_price if base_price > 0 else 0
    discount_ratio = discount_amount / base_price if base_price > 0 else 0
    is_price_above_max = 1 if final_price > max_price else 0
    
    return {
        'final_price': final_price,
        'base_price': base_price,
        'discount_amount': discount_amount,
        'price_markup_ratio': price_markup_ratio,
        'num_tickets': ticket.num_tickets,
        'ticket_class_id': ticket_class_id,
        'station_from_id': ticket.station_from_id,
        'station_to_id': ticket.station_to_id,
        'payment_method_id': ticket.payment_method_id,
        'booking_channel_id': ticket.booking_channel_id,
        'is_refund': int(ticket.is_refund),
        'is_popular_route': int(ticket.is_popular_route),
        'is_price_above_max': is_price_above_max,
        'discount_ratio': discount_ratio
    }


def validate_ticket_price(ticket_class_id: int, final_price: float) -> dict:
    """
    Validasi harga tiket berdasarkan kelas.
    """
    if ticket_class_id not in TICKET_CLASSES:
        return {
            'is_valid': False,
            'is_suspicious': True,
            'message': 'Invalid ticket class',
            'price_deviation': 0,
            'expected_range': 'N/A',
            'class_name': 'Unknown'
        }
    
    class_info = TICKET_CLASSES[ticket_class_id]
    min_price = class_info['min']
    max_price = class_info['max']
    max_allowed = max_price * 1.1  # 10% tolerance
    
    is_valid = min_price <= final_price <= max_allowed
    is_suspicious = final_price > (max_price * 1.5)
    
    if final_price < min_price:
        deviation = ((min_price - final_price) / min_price) * -100
    elif final_price > max_price:
        deviation = ((final_price - max_price) / max_price) * 100
    else:
        deviation = 0
    
    return {
        'is_valid': is_valid,
        'is_suspicious': is_suspicious,
        'price_deviation': round(deviation, 2),
        'expected_range': f"Rp {min_price:,.0f} - Rp {max_price:,.0f}",
        'class_name': class_info['name']
    }

=======

    final_price = float(ticket.price)
    base_price = class_info['base']
    max_price = class_info['max']
    discount_amount = float(getattr(ticket, 'discount_amount', 0))

    # Calculate derived features
    price_markup_ratio = final_price / base_price if base_price > 0 else 0
    discount_ratio = discount_amount / base_price if base_price > 0 else 0
    is_price_above_max = 1 if final_price > max_price else 0

    return {
        'final_price': final_price,
        'base_price': base_price,
        'discount_amount': discount_amount,
        'price_markup_ratio': price_markup_ratio,
        'num_tickets': ticket.num_tickets,
        'ticket_class_id': ticket_class_id,
        'station_from_id': ticket.station_from_id,
        'station_to_id': ticket.station_to_id,
        'payment_method_id': ticket.payment_method_id,
        'booking_channel_id': ticket.booking_channel_id,
        'is_refund': int(ticket.is_refund),
        'is_popular_route': int(ticket.is_popular_route),
        'is_price_above_max': is_price_above_max,
        'discount_ratio': discount_ratio
    }


def validate_ticket_price(ticket_class_id: int, final_price: float) -> dict:
    """
    Validasi harga tiket berdasarkan kelas.
    """
    if ticket_class_id not in TICKET_CLASSES:
        return {
            'is_valid': False,
            'is_suspicious': True,
            'message': 'Invalid ticket class',
            'price_deviation': 0,
            'expected_range': 'N/A',
            'class_name': 'Unknown'
        }

    class_info = TICKET_CLASSES[ticket_class_id]
    min_price = class_info['min']
    max_price = class_info['max']
    max_allowed = max_price * 1.1  # 10% tolerance

    is_valid = min_price <= final_price <= max_allowed
    is_suspicious = final_price > (max_price * 1.5)

    if final_price < min_price:
        deviation = ((min_price - final_price) / min_price) * -100
    elif final_price > max_price:
        deviation = ((final_price - max_price) / max_price) * 100
    else:
        deviation = 0

    return {
        'is_valid': is_valid,
        'is_suspicious': is_suspicious,
        'price_deviation': round(deviation, 2),
        'expected_range': f"Rp {min_price:,.0f} - Rp {max_price:,.0f}",
        'class_name': class_info['name']
    }

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
# ---------------- Core Functions ---------------- #

def buy_ticket(ticket: TicketCreate) -> dict:
    """
    Analisis transaksi tiket dengan ScalperDetectorAPI (14 features)
    + insert ke database
    """
    # Calculate features untuk model
    ticket_features = calculate_ticket_features(ticket)
<<<<<<< HEAD
    
    # Prediksi anomaly / scalper
    result = api_detector.predict(ticket_features)
    pred_label = -1 if result['prediction'] == 'anomaly' else 1
    score = result['score'] * -100 
    risk_score = result.get('risk_score', 0)
    risk_level = result.get('risk_level', 'Low')
    is_scalper = result.get('is_scalper', False)
    
=======

    # Prediksi anomaly / scalper
    result = api_detector.predict(ticket_features)
    pred_label = -1 if result['prediction'] == 'anomaly' else 1
    score = result['score'] * -100
    risk_score = result.get('risk_score', 0)
    risk_level = result.get('risk_level', 'Low')
    is_scalper = result.get('is_scalper', False)

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
    # Validasi harga berdasarkan ticket class
    ticket_class_id = getattr(ticket, 'ticket_class_id', 1)
    price_validation = validate_ticket_price(ticket_class_id, float(ticket.price))

    # Ensure user exists in profile table
    user_uuid = ensure_uuid(ticket.user_id)
    user_exists = supabase.table("profile").select("id").eq("id", user_uuid).execute()
    if not user_exists.data:
        # Insert dummy user for testing purposes
        supabase.table("profile").insert({"id": user_uuid, "name": "Test User", "email": "test@example.com", "role": "user"}).execute()

    # Insert ke transactions table
    trx_data = {
        "user_id": user_uuid,
        "origin_id": 1,
        "station_from_id": ticket.station_from_id,
        "station_to_id": ticket.station_to_id,
        "total_amount": float(ticket.price),
        "payment_method_id": ticket.payment_method_id,
        "booking_channel_id": ticket.booking_channel_id,
        "status_id": 1,
<<<<<<< HEAD
=======
        "num_tickets": ticket.num_tickets,
>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
        "device_fingerprint": ticket.device_id,
        "ip_address": ticket.ip_id or generate_dummy_ip(),
        "is_refund": int(ticket.is_refund),
        "anomaly_score": float(score),
        "anomaly_label_id": 1 if pred_label == 1 else 2,
        "fraud_flag": int(is_scalper),
    }
    trx = transaction_model.create_transaction(trx_data)
    trx_id = trx.data[0]["id"]

    # Insert ke tickets table (per penumpang/seat)
    seat_numbers = ticket.seat_number or []
    passenger_names = ticket.passenger_name if isinstance(ticket.passenger_name, list) else [ticket.passenger_name]
<<<<<<< HEAD
    
    base_price = ticket_features['base_price']
    discount = ticket_features['discount_amount']
    
    for idx, seat in enumerate(seat_numbers):
        ticket_price = float(ticket.price / ticket.num_tickets)
        
        ticket_model.create_ticket({
            "transaction_id": str(trx_id),
            "passenger_name": passenger_names[idx] if idx < len(passenger_names) else f"Passenger {idx+1}",
            "seat_number": seat,
            "price": ticket_price,
            "ticket_class_id": ticket_class_id,
            "base_price": base_price,
            "discount_amount": discount / ticket.num_tickets if discount > 0 else 0,
            "final_price": ticket_price,
            "status_id": 1,
            "station_from_id": ticket.station_from_id,
            "station_to_id": ticket.station_to_id,
        })

=======

    base_price = ticket_features['base_price']
    discount = ticket_features['discount_amount']

    for idx, seat in enumerate(seat_numbers):
        ticket_price = float(ticket.price / ticket.num_tickets)

        ticket_model.create_ticket({
            "transaction_id": str(trx_id),
            "passenger_name": passenger_names[idx] if idx < len(passenger_names) else f"Passenger {idx+1}",
            "seat_number": seat,
            "price": ticket_price,
            "ticket_class_id": ticket_class_id,
            "base_price": base_price,
            "discount_amount": discount / ticket.num_tickets if discount > 0 else 0,
            "final_price": ticket_price,
            "status_id": 1,
            "station_from_id": ticket.station_from_id,
            "station_to_id": ticket.station_to_id,
        })

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
    # Build response
    t_time = parse_datetime(ticket.transaction_time)
    hour = t_time.hour
    day_of_week = t_time.weekday()
    is_weekend = 1 if day_of_week >= 5 else 0
    is_night = 1 if hour < 6 or hour >= 22 else 0
    is_peak_hour = 1 if hour in [7, 8, 17, 18] else 0
    price_per_ticket = float(ticket.price) / max(ticket.num_tickets, 1)

    response = {
        "transaction_id": str(trx_id),
        "user_id": ensure_uuid(ticket.user_id),
        "price": float(ticket.price),
        "num_tickets": ticket.num_tickets,
        "ticket_class_id": ticket_class_id,
        "station_from_id": ticket.station_from_id,
        "station_to_id": ticket.station_to_id,
        "payment_method_id": ticket.payment_method_id,
        "booking_channel_id": ticket.booking_channel_id,
        "is_refund": int(ticket.is_refund),
        "transaction_time": t_time.isoformat(),
        "hour": hour,
        "day_of_week": day_of_week,
        "is_weekend": is_weekend,
        "is_night": is_night,
        "is_peak_hour": is_peak_hour,
        "price_per_ticket": price_per_ticket,
        "is_popular_route": int(ticket.is_popular_route),
        "price_category": int(ticket.price_category),
        "tickets_category": int(ticket.tickets_category),
        "device_id": ticket.device_id,
        "ip_id": ticket.ip_id,
        "passenger_name": passenger_names,
        "seat_number": seat_numbers,
        "id": str(uuid.uuid4()),
        "created_at": datetime.utcnow().isoformat(),
<<<<<<< HEAD
        
=======

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
        # Model prediction results
        "prediction": result['prediction'],
        "score": float(score),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "is_scalper": is_scalper,
<<<<<<< HEAD
        
=======

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
        # Price validation results
        "price_validation": {
            "is_valid": price_validation['is_valid'],
            "is_suspicious": price_validation['is_suspicious'],
            "price_deviation": price_validation['price_deviation'],
            "expected_range": price_validation['expected_range'],
            "class_name": price_validation['class_name']
        },
<<<<<<< HEAD
        
=======

>>>>>>> 181ad786d3ed78c96f0f356ae1666e6e494bb63a
        # Additional model features
        "model_features": {
            "price_markup_ratio": round(ticket_features['price_markup_ratio'], 2),
            "is_price_above_max": ticket_features['is_price_above_max'],
            "base_price": ticket_features['base_price'],
            "discount_ratio": round(ticket_features['discount_ratio'], 2)
        }
    }
    return response


def buy_ticket_auto(ticket: TicketCreate) -> dict:
    """Buat tiket tanpa analisis anomaly"""
    ticket_model.create_ticket(ticket)
    return {"message": "Ticket created"}


def list_tickets() -> list[TicketResponse]:
    """Ambil semua tiket dari database"""
    response = ticket_model.get_tickets()
    return response.data
