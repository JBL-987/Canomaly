from pydantic import BaseModel

class AnomalyLabelBase(BaseModel):
    label: str
    severity_level: int = 1

class AnomalyLabelCreate(AnomalyLabelBase):
    pass

class AnomalyLabelResponse(AnomalyLabelBase):
    id: int
