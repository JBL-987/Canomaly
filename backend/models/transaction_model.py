from config.supabase import supabase


def create_transaction(data: dict):
    return supabase.table("transactions").insert(data).execute()


def get_transactions():
    return supabase.table("transactions").select("*").execute()


def get_transaction_by_id(tx_id: str):
    return supabase.table("transactions").select("*").eq("id", tx_id).single().execute()
