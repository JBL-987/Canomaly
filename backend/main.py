from fastapi import FastAPI
from routers import ticket_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ticket_router.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to Canomaly. Hit /help to get help!",
    }
