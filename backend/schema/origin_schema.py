from pydantic import BaseModel

class OriginBase(BaseModel):
    name: str

class OriginCreate(OriginBase):
    pass

class OriginResponse(OriginBase):
    id: int
