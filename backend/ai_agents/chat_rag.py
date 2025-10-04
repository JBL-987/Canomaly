import os
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Konfigurasi
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Setup
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.0-flash-exp')
embedding_model = 'models/text-embedding-004'

def query_embedding(text: str):
    """Buat embedding untuk query"""
    result = genai.embed_content(
        model=embedding_model,
        content=text,
        task_type="retrieval_query"
    )
    return result['embedding']

def search_documents(query: str, top_k: int = 5):
    """Cari dokumen yang relevan dari knowledge base"""
    query_emb = query_embedding(query)
    
    result = supabase.rpc(
        'match_rag_documents',
        {
            'query_embedding': query_emb,
            'match_count': top_k
        }
    ).execute()
    
    return result.data if result.data else []

def get_realtime_stats():
    """Ambil statistik real-time dari database untuk konteks tambahan"""
    try:
        # Total transaksi dan anomali
        all_txn = supabase.table("transactions").select("id, fraud_flag", count="exact").execute()
        anomaly_txn = supabase.table("transactions").select("id", count="exact").eq("fraud_flag", True).execute()
        
        total = all_txn.count if all_txn.count else 0
        anomalies = anomaly_txn.count if anomaly_txn.count else 0
        
        stats = f"[Real-time Stats: Total {total} transaksi, {anomalies} anomali terdeteksi]"
        return stats
    except:
        return ""

def clean_formatting(text: str):
    """Bersihkan formatting seperti **bold** dari text"""
    import re
    # Hapus **bold** markers
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    # Hapus *italic* markers
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    # Hapus markdown headers
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    return text.strip()

def ask(question: str):
    """Tanya AI dengan RAG untuk monitoring anomaly"""
    print(f"\n🔍 Mencari informasi relevan...")

    # 1. Cari dokumen yang relevan dari knowledge base
    docs = search_documents(question, top_k=5)

    if not docs:
        return "Maaf, saya tidak menemukan informasi yang relevan dalam knowledge base. Pastikan knowledge base sudah di-build dengan menjalankan build_anomaly_knowledge.py terlebih dahulu."

    # 2. Buat context dari dokumen
    context = "\n\n".join([f"- {doc['content']}" for doc in docs])

    # 3. Ambil stats real-time jika diperlukan
    realtime_stats = get_realtime_stats()

    # 4. Generate jawaban dengan prompt yang di-optimize untuk monitoring anomaly
    prompt = f"""Kamu adalah AI Assistant untuk sistem monitoring anomaly pembelian tiket kereta api.
Tugas kamu adalah membantu admin memahami dan memonitor transaksi yang terdeteksi anomali atau fraud.

KONTEKS DARI KNOWLEDGE BASE:
{context}

{realtime_stats}

PERTANYAAN ADMIN: {question}

INSTRUKSI:
1. Jawab dengan bahasa Indonesia yang natural, profesional tapi tetap ramah
2. Berikan insight yang actionable dan spesifik
3. Jika pertanyaan tentang angka/statistik, sebutkan angka konkret dari konteks
4. Jika pertanyaan tentang cara monitoring, berikan step-by-step guidance
5. Jika ada indikator fraud/scalper, jelaskan dengan detail
6. Gunakan emoji yang relevan untuk membuat response lebih engaging (🚨 untuk critical, ⚠️ untuk warning, ✅ untuk normal, dll)
7. Jika konteks tidak cukup untuk jawab, akui keterbatasan tapi berikan guidance umum
8. FORMAT CLEAN - SANGAT PENTING: JANGAN PERNAH gunakan tanda bintang (*) ATAU tanda bintang ganda (**) untuk formatting apa pun. JANGAN gunakan markdown. Gunakan paragraf biasa tanpa bullet points, tanpa bold, tanpa italic, tanpa list. Pastikan response mudah dibaca dan profesional - hanya teks biasa tanpa formatting khusus.

JAWABAN:"""

    print(f"💭 Memproses jawaban...")
    response = model.generate_content(prompt)

    # 5. Bersihkan formatting dari response
    clean_response = clean_formatting(response.text)

    return clean_response

def show_welcome():
    """Tampilkan welcome message"""
    print("\n" + "="*80)
    print("🤖 AI ASSISTANT - ANOMALY MONITORING SISTEM PEMESANAN TIKET")
    print("="*80)
    print("\n👋 Halo Admin! Saya siap membantu Anda memonitor transaksi anomali.")
    print("\nContoh pertanyaan yang bisa Anda tanyakan:")
    print("  📊 Statistik & Overview:")
    print("     - Berapa banyak transaksi anomali hari ini?")
    print("     - Tampilkan overview anomali detection")
    print("     - Berapa persentase anomali dari total transaksi?")
    print("")
    print("  🚨 Risk Analysis:")
    print("     - Ada berapa transaksi dengan risk level Critical?")
    print("     - Jelaskan tentang risk score dan level")
    print("     - Transaksi mana yang perlu investigasi segera?")
    print("")
    print("  🎫 Scalper Detection:")
    print("     - Apakah ada indikasi scalper?")
    print("     - Bagaimana cara mendeteksi bulk buying?")
    print("     - Rute mana yang sering jadi target scalper?")
    print("")
    print("  💰 Price Anomaly:")
    print("     - Ada anomali pada harga tiket?")
    print("     - Jelaskan tentang price markup anomaly")
    print("     - Transaksi mana yang memiliki harga tidak wajar?")
    print("")
    print("  📱 Channel & Payment:")
    print("     - Channel mana yang paling banyak anomali?")
    print("     - Apakah ada payment method yang mencurigakan?")
    print("     - Perlu monitoring extra di channel apa?")
    print("")
    print("  🖥️  Device & IP:")
    print("     - Ada device yang melakukan transaksi mencurigakan?")
    print("     - Bagaimana cara deteksi bot atau automated fraud?")
    print("     - Apakah ada IP address yang suspicious?")
    print("")
    print("  ⏰ Temporal Analysis:")
    print("     - Kapan biasanya anomali terjadi?")
    print("     - Apakah ada spike anomali pada peak hour?")
    print("     - Bagaimana pattern anomali weekend vs weekday?")
    print("")
    print("  📋 Monitoring Guidelines:")
    print("     - Bagaimana cara monitoring yang efektif?")
    print("     - Apa yang harus dilakukan untuk transaksi Critical?")
    print("     - Langkah-langkah investigasi fraud")
    print("")
    print("  ↩️  Refund Monitoring:")
    print("     - Ada indikasi refund abuse?")
    print("     - Bagaimana pattern refund yang mencurigakan?")
    print("-"*80)
    print("\n💡 Tips: Ketik 'help' untuk melihat panduan ini lagi")
    print("💡 Tips: Ketik 'stats' untuk melihat statistik real-time")
    print("💡 Tips: Ketik 'exit' atau 'quit' untuk keluar\n")

def show_realtime_stats():
    """Tampilkan statistik real-time"""
    print("\n📊 STATISTIK REAL-TIME")
    print("="*80)
    
    try:
        # Total transaksi
        all_txn = supabase.table("transactions").select("id, fraud_flag, anomaly_score", count="exact").execute()
        anomaly_txn = supabase.table("transactions").select("id", count="exact").eq("fraud_flag", True).execute()
        
        total = all_txn.count if all_txn.count else 0
        anomalies = anomaly_txn.count if anomaly_txn.count else 0
        normal = total - anomalies
        
        print(f"\n📈 Total Transaksi: {total:,}")
        print(f"✅ Normal: {normal:,} ({normal/total*100:.1f}%)")
        print(f"🚨 Anomali: {anomalies:,} ({anomalies/total*100:.1f}%)")
        
        # Anomali labels (severity)
        if anomalies > 0:
            labels = supabase.table("anomaly_labels").select("severity_level", count="exact").execute()
            
            print(f"\n⚠️  Breakdown Severity:")
            severity_count = {}
            for label in labels.data:
                sev = label.get('severity_level', 'unknown')
                severity_count[sev] = severity_count.get(sev, 0) + 1
            
            for sev, count in sorted(severity_count.items(), key=lambda x: x[1], reverse=True):
                emoji = "🔴" if sev == "critical" else "🟠" if sev == "high" else "🟡" if sev == "medium" else "🟢"
                print(f"   {emoji} {sev.capitalize()}: {count} transaksi")
        
        print("\n" + "="*80)
        
    except Exception as e:
        print(f"❌ Error mengambil statistik: {e}")

def main():
    """Main chat loop"""
    show_welcome()
    
    while True:
        try:
            # Input pertanyaan
            question = input("\n❓ Anda: ").strip()
            
            # Cek exit
            if question.lower() in ['exit', 'quit', 'keluar', 'bye']:
                print("\n👋 Terima kasih sudah menggunakan Anomaly Monitoring Assistant!")
                print("   Stay vigilant dan keep monitoring! 🚀\n")
                break
            
            # Cek help
            if question.lower() in ['help', 'bantuan', '?']:
                show_welcome()
                continue
            
            # Cek stats
            if question.lower() in ['stats', 'statistik', 'dashboard']:
                show_realtime_stats()
                continue
            
            # Skip jika kosong
            if not question:
                continue
            
            # Proses pertanyaan dengan RAG
            answer = ask(question)
            
            # Tampilkan jawaban
            print(f"\n🤖 AI Assistant:\n")
            print(answer)
            print("\n" + "-"*80)
            
        except KeyboardInterrupt:
            print("\n\n👋 Terima kasih sudah menggunakan Anomaly Monitoring Assistant!")
            print("   Stay vigilant dan keep monitoring! 🚀\n")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")
            print("Silakan coba lagi atau ketik 'help' untuk panduan.\n")

if __name__ == "__main__":
    main()
