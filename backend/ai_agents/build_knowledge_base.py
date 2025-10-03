import os
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)
embedding_model = 'models/text-embedding-004'

def create_embedding(text: str):
    """Buat embedding dari text menggunakan Gemini"""
    result = genai.embed_content(
        model=embedding_model,
        content=text,
        task_type="retrieval_document"
    )
    return result['embedding']

def build_anomaly_overview():
    """Overview anomali dan fraud detection"""
    print("🔍 Building anomaly detection overview...")
    
    transactions = supabase.table("transactions").select("*").execute()
    documents = []
    
    total = len(transactions.data)
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    normal_txns = [t for t in transactions.data if not t.get('fraud_flag')]
    
    # Overview utama
    overview = f"""Sistem monitoring anomaly pembelian tiket memantau {total} transaksi. 
Terdapat {len(anomaly_txns)} transaksi terdeteksi anomali ({len(anomaly_txns)/total*100:.1f}%) dan 
{len(normal_txns)} transaksi normal ({len(normal_txns)/total*100:.1f}%). 
Sistem menggunakan risk score 0-100 dengan kategori: Low (<30), Medium (30-60), High (60-80), dan Critical (>80)."""
    
    documents.append({
        "content": overview,
        "metadata": {
            "type": "anomaly_overview",
            "total_transactions": total,
            "total_anomalies": len(anomaly_txns)
        }
    })
    
    print(f"   ✓ Created {len(documents)} overview documents")
    return documents

def build_risk_analysis():
    """Analisis risk score dan risk level"""
    print("⚠️  Analyzing risk scores and levels...")
    
    transactions = supabase.table("transactions").select("*").execute()
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    documents = []
    
    if not anomaly_txns:
        return documents
    
    # Analisis risk level distribution
    risk_levels = {}
    for txn in anomaly_txns:
        labels = supabase.table("anomaly_labels").select("*").eq(
            "id", txn.get('anomaly_label_id')
        ).execute()
        
        if labels.data:
            level = labels.data[0].get('severity_level', 'unknown')
            # Convert ke string jika integer
            level_str = str(level) if level is not None else 'unknown'
            risk_levels[level_str] = risk_levels.get(level_str, 0) + 1
    
    if risk_levels:
        # Map severity level untuk display
        severity_map = {
            '1': 'Low', '2': 'Medium', '3': 'High', '4': 'Critical',
            'low': 'Low', 'medium': 'Medium', 'high': 'High', 'critical': 'Critical',
            'unknown': 'Unknown'
        }
        
        risk_text = f"""Distribusi risk level pada anomali: {', '.join([
            f'{severity_map.get(k.lower(), k)}: {v} transaksi ({v/len(anomaly_txns)*100:.1f}%)' 
            for k, v in sorted(risk_levels.items(), key=lambda x: x[1], reverse=True)
        ])}. Transaksi dengan risk level Critical memerlukan investigasi segera."""
        
        documents.append({
            "content": risk_text,
            "metadata": {
                "type": "risk_level_distribution",
                "data": risk_levels
            }
        })
    
    # Analisis anomaly score distribution
    scores = [float(t.get('anomaly_score', 0)) for t in anomaly_txns if t.get('anomaly_score') is not None]
    if scores:
        avg_score = sum(scores) / len(scores)
        max_score = max(scores)
        min_score = min(scores)
        
        score_text = f"""Anomaly score berkisar dari {min_score:.2f} hingga {max_score:.2f} dengan rata-rata {avg_score:.2f}. 
Score mendekati -1 menunjukkan outlier kuat, sedangkan mendekati 1 menunjukkan data normal. 
Semakin rendah score, semakin tinggi tingkat keparahan anomali."""
        
        documents.append({
            "content": score_text,
            "metadata": {
                "type": "anomaly_score_analysis",
                "avg_score": avg_score,
                "max_score": max_score,
                "min_score": min_score
            }
        })
    
    print(f"   ✓ Created {len(documents)} risk analysis documents")
    return documents

def build_price_anomaly_analysis():
    """Analisis anomali berdasarkan pricing (final_price, base_price, discount)"""
    print("💰 Analyzing price-based anomalies...")
    
    transactions = supabase.table("transactions").select("*").execute()
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    normal_txns = [t for t in transactions.data if not t.get('fraud_flag')]
    documents = []
    
    # Total amount comparison - filter None values
    anomaly_amounts = [float(t.get('total_amount')) for t in anomaly_txns 
                       if t.get('total_amount') is not None]
    normal_amounts = [float(t.get('total_amount')) for t in normal_txns 
                      if t.get('total_amount') is not None]
    
    if anomaly_amounts and normal_amounts:
        avg_anomaly = sum(anomaly_amounts) / len(anomaly_amounts)
        avg_normal = sum(normal_amounts) / len(normal_amounts)
        max_anomaly = max(anomaly_amounts)
        min_anomaly = min(anomaly_amounts)
        
        price_text = f"""Analisis harga transaksi anomali: rata-rata Rp {avg_anomaly:,.0f} vs normal Rp {avg_normal:,.0f}. 
Range harga anomali dari Rp {min_anomaly:,.0f} hingga Rp {max_anomaly:,.0f}. """
        
        if avg_anomaly > avg_normal * 1.5:
            price_text += "Transaksi anomali cenderung memiliki nilai yang jauh lebih tinggi, mengindikasikan possible bulk buying atau scalping."
        elif avg_anomaly < avg_normal * 0.5:
            price_text += "Transaksi anomali cenderung memiliki nilai yang lebih rendah, mengindikasikan possible discount abuse atau pricing error."
        
        documents.append({
            "content": price_text,
            "metadata": {
                "type": "price_anomaly_analysis",
                "avg_anomaly": avg_anomaly,
                "avg_normal": avg_normal
            }
        })
    
    # Price markup analysis
    high_markup = [t for t in anomaly_txns if t.get('price_category') == 3]  # Assuming 3 = high price
    if high_markup:
        markup_text = f"""{len(high_markup)} transaksi anomali terdeteksi dengan harga di atas kategori maksimal (is_price_above_max). 
Ini bisa mengindikasikan price manipulation atau unusual pricing conditions."""
        
        documents.append({
            "content": markup_text,
            "metadata": {
                "type": "price_markup_anomaly",
                "count": len(high_markup)
            }
        })
    
    print(f"   ✓ Created {len(documents)} price anomaly documents")
    return documents

def build_scalper_detection_analysis():
    """Analisis perilaku scalper"""
    print("🎫 Analyzing scalper behavior patterns...")
    
    transactions = supabase.table("transactions").select(
        "*, booking_channels(name)"
    ).execute()
    documents = []
    
    # Transaksi dengan multiple tickets (potential scalper)
    bulk_buyers = [t for t in transactions.data 
                   if (t.get('num_tickets') or 0) > 5 and t.get('fraud_flag')]
    
    if bulk_buyers:
        avg_tickets = sum([(t.get('num_tickets') or 0) for t in bulk_buyers]) / len(bulk_buyers)
        scalper_text = f"""Terdeteksi {len(bulk_buyers)} transaksi dengan pembelian bulk tickets (>5 tiket) yang flagged sebagai anomali. 
Rata-rata {avg_tickets:.1f} tiket per transaksi. Pola ini mengindikasikan potential scalper behavior. 
Scalper biasanya membeli tiket dalam jumlah besar untuk dijual kembali dengan harga lebih tinggi."""
        
        documents.append({
            "content": scalper_text,
            "metadata": {
                "type": "scalper_detection",
                "count": len(bulk_buyers),
                "avg_tickets": avg_tickets
            }
        })
    
    # Analisis popular route dengan anomaly
    popular_route_anomaly = [t for t in transactions.data 
                             if t.get('is_popular_route') and t.get('fraud_flag')]
    
    if popular_route_anomaly:
        route_text = f"""{len(popular_route_anomaly)} anomali terjadi pada rute populer. 
Rute populer sering menjadi target scalper karena tingginya demand. 
Monitoring ketat diperlukan pada rute-rute ini terutama saat peak season."""
        
        documents.append({
            "content": route_text,
            "metadata": {
                "type": "popular_route_anomaly",
                "count": len(popular_route_anomaly)
            }
        })
    
    print(f"   ✓ Created {len(documents)} scalper analysis documents")
    return documents

def build_channel_payment_anomaly():
    """Analisis anomali per booking channel dan payment method"""
    print("📱 Analyzing channel and payment anomalies...")
    
    transactions = supabase.table("transactions").select(
        "*, booking_channels(name), payment_methods(name)"
    ).execute()
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    documents = []
    
    # Channel analysis
    channel_stats = {}
    total_per_channel = {}
    
    for txn in transactions.data:
        channel = txn.get('booking_channels', {}).get('name', 'Unknown') if txn.get('booking_channels') else 'Unknown'
        total_per_channel[channel] = total_per_channel.get(channel, 0) + 1
        
        if txn.get('fraud_flag'):
            channel_stats[channel] = channel_stats.get(channel, 0) + 1
    
    if channel_stats:
        channel_text = "Anomali per booking channel: " + ", ".join([
            f"{k} memiliki {v} anomali dari {total_per_channel.get(k, 0)} transaksi ({v/total_per_channel.get(k, 1)*100:.1f}%)"
            for k, v in sorted(channel_stats.items(), key=lambda x: x[1], reverse=True)
        ])
        
        documents.append({
            "content": channel_text,
            "metadata": {
                "type": "channel_anomaly_distribution",
                "data": channel_stats
            }
        })
    
    # Payment method analysis
    payment_stats = {}
    total_per_payment = {}
    
    for txn in transactions.data:
        payment = txn.get('payment_methods', {}).get('name', 'Unknown') if txn.get('payment_methods') else 'Unknown'
        total_per_payment[payment] = total_per_payment.get(payment, 0) + 1
        
        if txn.get('fraud_flag'):
            payment_stats[payment] = payment_stats.get(payment, 0) + 1
    
    if payment_stats:
        payment_text = "Anomali per metode pembayaran: " + ", ".join([
            f"{k} memiliki {v} anomali dari {total_per_payment.get(k, 0)} transaksi ({v/total_per_payment.get(k, 1)*100:.1f}%)"
            for k, v in sorted(payment_stats.items(), key=lambda x: x[1], reverse=True)
        ])
        
        documents.append({
            "content": payment_text,
            "metadata": {
                "type": "payment_anomaly_distribution",
                "data": payment_stats
            }
        })
    
    print(f"   ✓ Created {len(documents)} channel/payment documents")
    return documents

def build_route_station_anomaly():
    """Analisis anomali berdasarkan rute dan stasiun"""
    print("🚉 Analyzing route and station anomalies...")
    
    transactions = supabase.table("transactions").select("*").execute()
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    documents = []
    
    # Station pair analysis
    route_anomalies = {}
    for txn in anomaly_txns:
        from_id = txn.get('station_from_id')
        to_id = txn.get('station_to_id')
        if from_id and to_id:
            route = f"{from_id}->{to_id}"
            route_anomalies[route] = route_anomalies.get(route, 0) + 1
    
    if route_anomalies:
        top_routes = sorted(route_anomalies.items(), key=lambda x: x[1], reverse=True)[:5]
        route_text = f"""Top 5 rute dengan anomali terbanyak: {', '.join([
            f"rute {k} dengan {v} anomali" for k, v in top_routes
        ])}. Monitoring intensif diperlukan pada rute-rute ini."""
        
        documents.append({
            "content": route_text,
            "metadata": {
                "type": "route_anomaly_hotspots",
                "data": dict(top_routes)
            }
        })
    
    print(f"   ✓ Created {len(documents)} route/station documents")
    return documents

def build_temporal_anomaly():
    """Analisis anomali berdasarkan waktu (hour, day_of_week, is_weekend, is_peak_hour)"""
    print("⏰ Analyzing temporal anomaly patterns...")
    
    transactions = supabase.table("transactions").select("*").execute()
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    documents = []
    
    # Peak hour analysis
    peak_anomalies = [t for t in anomaly_txns if t.get('is_peak_hour')]
    if peak_anomalies:
        peak_text = f"""{len(peak_anomalies)} anomali terjadi pada peak hour ({len(peak_anomalies)/len(anomaly_txns)*100:.1f}% dari total anomali). 
Peak hour adalah waktu tersibuk dengan demand tinggi, sering menjadi target scalper."""
        
        documents.append({
            "content": peak_text,
            "metadata": {
                "type": "peak_hour_anomaly",
                "count": len(peak_anomalies)
            }
        })
    
    # Weekend analysis
    weekend_anomalies = [t for t in anomaly_txns if t.get('is_weekend')]
    if weekend_anomalies:
        weekend_text = f"""{len(weekend_anomalies)} anomali terjadi pada weekend ({len(weekend_anomalies)/len(anomaly_txns)*100:.1f}% dari total anomali). 
Weekend biasanya memiliki pattern berbeda dari weekday."""
        
        documents.append({
            "content": weekend_text,
            "metadata": {
                "type": "weekend_anomaly",
                "count": len(weekend_anomalies)
            }
        })
    
    # Night time analysis
    night_anomalies = [t for t in anomaly_txns if t.get('is_night')]
    if night_anomalies:
        night_text = f"""{len(night_anomalies)} anomali terjadi pada malam hari ({len(night_anomalies)/len(anomaly_txns)*100:.1f}% dari total anomali). 
Transaksi malam hari yang unusual perlu monitoring extra."""
        
        documents.append({
            "content": night_text,
            "metadata": {
                "type": "night_time_anomaly",
                "count": len(night_anomalies)
            }
        })
    
    print(f"   ✓ Created {len(documents)} temporal documents")
    return documents

def build_device_fingerprint_anomaly():
    """Analisis anomali berdasarkan device fingerprint dan IP"""
    print("🖥️  Analyzing device and IP anomalies...")
    
    transactions = supabase.table("transactions").select("*").execute()
    anomaly_txns = [t for t in transactions.data if t.get('fraud_flag')]
    documents = []
    
    # Duplicate device fingerprint
    device_count = {}
    for txn in anomaly_txns:
        device = txn.get('device_hash')
        if device:
            device_count[device] = device_count.get(device, 0) + 1
    
    suspicious_devices = {k: v for k, v in device_count.items() if v > 3}
    if suspicious_devices:
        device_text = f"""{len(suspicious_devices)} device terdeteksi melakukan multiple transaksi anomali (>3 transaksi). 
Ini mengindikasikan potential automated bot atau systematic fraud."""
        
        documents.append({
            "content": device_text,
            "metadata": {
                "type": "suspicious_device_detection",
                "count": len(suspicious_devices)
            }
        })
    
    # IP hash analysis
    ip_count = {}
    for txn in anomaly_txns:
        ip = txn.get('ip_hash')
        if ip:
            ip_count[ip] = ip_count.get(ip, 0) + 1
    
    suspicious_ips = {k: v for k, v in ip_count.items() if v > 3}
    if suspicious_ips:
        ip_text = f"""{len(suspicious_ips)} IP address terdeteksi melakukan multiple transaksi anomali (>3 transaksi). 
Perlu dicek apakah ini dari VPN, proxy, atau bot network."""
        
        documents.append({
            "content": ip_text,
            "metadata": {
                "type": "suspicious_ip_detection",
                "count": len(suspicious_ips)
            }
        })
    
    print(f"   ✓ Created {len(documents)} device/IP documents")
    return documents

def build_refund_anomaly():
    """Analisis anomali pada transaksi refund"""
    print("↩️  Analyzing refund anomalies...")
    
    transactions = supabase.table("transactions").select("*").execute()
    documents = []
    
    refund_anomalies = [t for t in transactions.data 
                        if t.get('is_refund') and t.get('fraud_flag')]
    
    if refund_anomalies:
        refund_text = f"""{len(refund_anomalies)} transaksi refund terdeteksi sebagai anomali. 
Pattern refund yang unusual bisa mengindikasikan refund fraud atau policy abuse. 
Perlu investigasi apakah ada pattern pembelian-refund berulang dari user yang sama."""
        
        documents.append({
            "content": refund_text,
            "metadata": {
                "type": "refund_anomaly",
                "count": len(refund_anomalies)
            }
        })
    
    print(f"   ✓ Created {len(documents)} refund documents")
    return documents

def build_monitoring_guidelines():
    """Panduan untuk admin dalam monitoring anomali"""
    print("📋 Building monitoring guidelines...")
    
    documents = []
    
    guidelines = [
        """Transaksi dengan risk_level 'Critical' harus segera di-review. 
Cek detail transaksi, verifikasi dengan user jika perlu, dan lakukan tindakan preventif.""",
        
        """Anomaly score di bawah -0.5 menunjukkan outlier yang kuat. 
Transaksi ini sangat berbeda dari pattern normal dan perlu investigasi mendalam.""",
        
        """Scalper detection: Waspadai pembelian bulk tickets (>10 tiket) dalam waktu singkat, 
terutama pada rute populer dan peak hour. Check device_hash dan ip_hash untuk detect bot.""",
        
        """Price anomaly: Transaksi dengan price_markup_ratio tinggi atau is_price_above_max 
perlu dicek apakah ada pricing error atau manipulation.""",
        
        """Pattern fraud indicators: Multiple transaksi dari device/IP yang sama, 
pembelian pada jam tidak wajar, atau sudden spike dalam transaksi user tertentu.""",
        
        """Refund monitoring: Pattern pembelian-refund berulang dari user yang sama 
bisa mengindikasikan policy abuse atau testing fraud methods.""",
        
        """Channel-specific monitoring: Beberapa channel mungkin lebih rentan terhadap fraud. 
Monitor anomaly rate per channel dan terapkan additional verification jika perlu.""",
        
        """Temporal patterns: Waspadai lonjakan anomali pada waktu tertentu (peak hour, weekend, night). 
Ini bisa mengindikasikan organized fraud attempts."""
    ]
    
    for i, guide in enumerate(guidelines, 1):
        documents.append({
            "content": guide,
            "metadata": {
                "type": "monitoring_guideline",
                "priority": i
            }
        })
    
    print(f"   ✓ Created {len(documents)} guideline documents")
    return documents

def store_knowledge_base():
    """Simpan semua knowledge ke tabel rag_documents"""
    print("\n" + "="*70)
    print("🔨 BUILDING ANOMALY MONITORING KNOWLEDGE BASE")
    print("="*70 + "\n")
    
    all_docs = []
    all_docs.extend(build_anomaly_overview())
    all_docs.extend(build_risk_analysis())
    all_docs.extend(build_price_anomaly_analysis())
    all_docs.extend(build_scalper_detection_analysis())
    all_docs.extend(build_channel_payment_anomaly())
    all_docs.extend(build_route_station_anomaly())
    all_docs.extend(build_temporal_anomaly())
    all_docs.extend(build_device_fingerprint_anomaly())
    all_docs.extend(build_refund_anomaly())
    all_docs.extend(build_monitoring_guidelines())
    
    print(f"\n📦 Total documents to store: {len(all_docs)}")
    print("⏳ Creating embeddings and storing...\n")
    
    for i, doc in enumerate(all_docs, 1):
        print(f"   [{i}/{len(all_docs)}] {doc['content'][:70]}...")
        
        embedding = create_embedding(doc['content'])
        
        data = {
            "content": doc['content'],
            "embedding": embedding,
            "metadata": doc['metadata']
        }
        
        supabase.table("rag_documents").insert(data).execute()
    
    print("\n" + "="*70)
    print(f"✅ Anomaly monitoring knowledge base built successfully!")
    print(f"✅ Stored {len(all_docs)} documents to database")
    print("="*70 + "\n")

if __name__ == "__main__":
    try:
        print("\n⚠️  WARNING: This will add new documents to rag_documents table")
        print("   If you want to rebuild from scratch, delete old data first:")
        print("   SQL: DELETE FROM rag_documents WHERE metadata->>'type' LIKE '%anomaly%';\n")
        
        confirm = input("Continue? (y/n): ")
        if confirm.lower() == 'y':
            store_knowledge_base()
        else:
            print("❌ Cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()