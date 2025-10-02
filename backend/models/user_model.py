from config.supabase import supabase


def create_user(data: dict):
    return supabase.table("users").insert(data).execute()


def get_users():
    return supabase.table("users").select("*").execute()


def get_user_by_email(email: str):
    return supabase.table("users").select("*").eq("email", email).single().execute()
