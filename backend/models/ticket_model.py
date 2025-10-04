from config.supabase import supabase


def create_ticket(data: dict):
    return supabase.table("tickets").insert(data).execute()


def get_tickets():
    return supabase.table("tickets").select("*").execute()


def get_ticket_by_id(ticket_id: str):
    return supabase.table("tickets").select("*").eq("id", ticket_id).single().execute()


def update_ticket(ticket_id: str, data: dict):
    return supabase.table("tickets").update(data).eq("id", ticket_id).execute()


def delete_ticket(ticket_id: str):
    return supabase.table("tickets").delete().eq("id", ticket_id).execute()
