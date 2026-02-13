import datetime
import shortuuid

def generate_uuid():
    return f"{datetime.date.today().year}-{shortuuid.ShortUUID().random(length=5)}"