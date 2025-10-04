# 🚅 Canomaly - AI-Powered Anomaly Detection for Train Ticket Booking

Sistem monitoring kecerdasan buatan untuk deteksi anomali pembelian tiket kereta api, dirancang khusus untuk mengidentifikasi Scalper, Bulk Buyer, dan kegiatan fraud lainnya secara real-time.

<img width="640" height="480" alt="Canomaly" src="https://github.com/user-attachments/assets/a49d7b92-52e5-4af1-9597-eec3a0003c60" />

## 🎯 Fitur Utama
### 🚨 Real-Time Anomaly Detection
- Deteksi otomatis menggunakan machine learning
- Alert real-time dengan visual confetti untuk anomali
- Monitoring 24/7 tanpa henti

### 🤖 AI Assistant
- Chat bot berbasis RAG (Retrieval-Augmented Generation)
- Insights yang dapat ditindaklanjuti
- Panduan monitoring fraud yang komprehensif

### 📊 Dashboard Admin
- Overview transaksi normal vs anomali
- Breakdown berdasarkan severity level
- Analisis temporal dan spatial

### 💳 Payment & Booking Monitoring
- Deteksi pola pembayaran tidak wajar
- Monitoring channel pembelian
- Deteksi penyalahgunaan refund

## 🏗️ Tech Stack

<img width="640" height="480" alt="Canomaly (1)" src="https://github.com/user-attachments/assets/5e05be26-8e01-474e-aeef-5548abaf35cb" />

### Frontend
- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety dan developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animasi smooth dan modern
- **Lucide React** - Icon library yang konsisten
- **ShadCN UI** - Component library yang keren dan modern

### Backend & Database
- **FastAPI** - Python web framework untuk high-performance APIs
- **Supabase** - Database dan real-time subscriptions
- **PostgreSQL** - Relational database yang powerful

### AI/ML
- **Gemini 2.5 Flash** - Latest AI model untuk text generation
- **Vector Embeddings** - Semantic search dengan pgvector
- **RAG Architecture** - Knowledge base untuk AI assistant
- **.pkl Model** - Machine learning model untuk outlier detection
- **Behavioral Analysis** - Deteksi pola pembelian mencurigakan

## 🚀 Setup & Installation
### Prerequisites
- Node.js 18+ & pnpm/npm
- Python 3.9+
- Git
- Google Gemini API Key
- Supabase Account

```bash
# Pastikan sudah punya pnpm / npm
node -v
npm -v
python --version
git --version
```

### 1. Clone Repository
```bash
git clone https://github.com/JBL-987/Canomaly.git
cd Canomaly
```

### 2. Jalankan Frontend
```bash
cd frontend
npm install
npm run dev          # Start development server

npm run build        # Build for production
npm run type-check   # TypeScript type checking
npm run lint         # ESLint checking
```

Quick Check Frontend
- Buka browser, pastikan landing page muncul
- Frontend akan berjalan di `http://localhost:3000`

### 3. Jalankan Backend
```bash
cd backend)
python -m venv venv         # Windows

venv\Scripts\activate       # Windows
source venv/bin/activate    # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload

#Building Knowledge Base for RAG
python build_knowledge_base.py    
```
Backend akan berjalan di `http://localhost:8000`

#### 4. Set .env dan .env.local
Create `backend/.env` file:
```env
SUPABASE_URL="https://oydqkrkacoddymqwzzyv.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZHFrcmthY29kZHltcXd6enl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTAyMzMsImV4cCI6MjA3NDk2NjIzM30.FMlDk8_QmLQAVKYCJIVS5ityo_9NvNA-NTfy2QR_6Gw"
GEMINI_API_KEY="AIzaSyBbtnZy5OvRjrWsdWmd6OoLrvhlvdwjjuw"
```

Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL="https://oydqkrkacoddymqwzzyv.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95ZHFrcmthY29kZHltcXd6enl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzOTAyMzMsImV4cCI6MjA3NDk2NjIzM30.FMlDk8_QmLQAVKYCJIVS5ityo_9NvNA-NTfy2QR_6Gw"
```
System dapat dijalankan tanpa Sign up/ Sign in

## 📁 Project Structure
```
Canomaly/
├── frontend/             # Next.js App
│   ├── app/              # App Router pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities & configurations
│   └── public/           # Static assets
├── backend/              # FastAPI App
│   ├── ai_agents/        # AI & ML components
│   ├── config/           # Database configs
│   ├── controllers/      # Business logic
│   ├── models/           # Models of 
│   ├── routers/          # API endpoints
│   ├── schema/           # Database schemas
│   └── services/         # ML services
└── README.md/            # Project documentation
```

## 🔍 Key Features Explained

<img width="640" height="480" alt="Canomaly (2)" src="https://github.com/user-attachments/assets/f8f0d586-8608-4640-aa09-f5c41db77967" />

### 🤖 AI Assistant untuk Admin
AI assistant berbasis RAG yang dirancang khusus untuk membantu admin dalam:
- Analisis statistik real-time
- Identifikasi tren anomali
- Panduan investigasi fraud
- Rekomendasi tindakan preventive

### 🔧 Anomaly Detection Algorithm
- **Isolation Forest**: Algoritma machine learning yang efektif untuk outlier detection pada data multi-dimensional
- **Behavioral Analysis**: Deteksi pola pembelian mencurigakan (bulk buying, unusual timing)
- **Risk Scoring**: Sistem skor 0-100 dengan kategori Low/Medium/High/Critical
- **Real-time Processing**: Monitoring kontinyu tanpa delay

### 📊 Core Features
1. **Real-time Alert System**: Notifikasi segera untuk anomali 
2. **Transaction Monitoring**: Pantau semua transaksi di berbagai channel
3. **Payment Pattern Analysis**: Deteksi fraud pada metode pembayaran
4. **Refund Abuse Detection**: Identifikasi pola refund yang tidak normal
5. **Scalper Detection**: Mendeteksi pembelian massal untuk dijual ulang

### 💯 Risk Scoring
- **Low (0-30)**: Normal behavior
- **Medium (30-60)**: Unusual but acceptable
- **High (60-80)**: High suspicion, perlu review
- **Critical (80+)**: Immediate investigation required

### 🦾 AI Assistant Capabilities
- **Statistical Analysis**: Real-time dashboard stats
- **Trend Identification**: Pattern recognition dari data historis
- **Risk Assessment**: Evaluasi risiko new transactions
- **Guideline Provision**: Best practices untuk fraud investigation

## 🔐 Security Considerations
- JWT authentication dengan refresh tokens
- Row Level Security (RLS) di Supabase
- API rate limiting
- Secure environment variable handling
- Input validation dan sanitization

## 📊 Monitoring & Logging
- Real-time error tracking
- Performance metrics monitoring
- User activity logging
- Alert system untuk critical anomalies

## 🤝 Contributing
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Create Pull Request

## 👥 Team
Developed by:
- @JBL-987
- @anandiooooooooooooooooooooooooooooooooo
- @abrahamgregorius
