from pydantic import BaseModel


class StationBase(BaseModel):
    code: str
    name: str
    city: str | None = None
    origin_id: int


class StationCreate(StationBase):
    pass


class StationResponse(StationBase):
    id: int
