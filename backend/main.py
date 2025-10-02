from fastapi import FastAPI
from routers import ticket_router

app = FastAPI()

app.include_router(ticket_router.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Canomaly. Hit /help to get help!",
    }
