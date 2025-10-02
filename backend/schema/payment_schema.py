from pydantic import BaseModel

class PaymentMethodBase(BaseModel):
    name: str

class PaymentMethodCreate(PaymentMethodBase):
    pass

class PaymentMethodResponse(PaymentMethodBase):
    id: int
