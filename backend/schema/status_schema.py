from pydantic import BaseModel

class StatusBase(BaseModel):
    name: str

class StatusCreate(StatusBase):
    pass

class StatusResponse(StatusBase):
    id: int
