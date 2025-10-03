from fastapi import APIRouter
from schema.chat_schema import ChatRequest, ChatResponse
from ai_agents.chat_rag import ask

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/ask", response_model=ChatResponse)
def ask_question(request: ChatRequest):
    """Endpoint untuk chat AI assistant anomaly monitoring"""
    try:
        answer = ask(request.question)
        return ChatResponse(answer=answer, status="success")
    except Exception as e:
        return ChatResponse(answer=f"Maaf, terjadi kesalahan: {str(e)}", status="error")
