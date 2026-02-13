from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

def generate_id(parent, image):
    id_front = Image.open('id/front.jpg')
    id_back = Image.open('id/back.jpg')

    now = datetime.now()
    date_of_issuance = now.strftime('%Y-%m-%d')

    with id_front.convert('RGBA') as id_front:
        id_front = ImageDraw.Draw(id_front)

        name = f"{parent.first_name} {parent.middle_name} {parent.last_name} {parent.suffix}"
        