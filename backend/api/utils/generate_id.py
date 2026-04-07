import base64
import io
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont
from django.conf import settings

# TODO; Replace with actual id to use
def generate_id_front(parent, images):
    id_front = Image.open(f"{settings.BASE_DIR}/api/static/id-front.png")
    for image in images:
        if image.image_type == 'id':
            picture = Image.open(image.image.open())
        if image.image_type == 'signature':
            signature = Image.open(image.image.open())

    # now = datetime.now()
    # date_of_issuance = now.strftime('%Y-%m-%d')

    with id_front as id_front:
        draw_front = ImageDraw.Draw(id_front)

        draw_front.text(
            (1150, 440),
            parent.last_name,
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )
        draw_front.text(
            (1150, 580),
            parent.first_name,
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )
        draw_front.text(
            (1150, 740),
            parent.middle_name,
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )

        # TODO; temporary need own field
        if parent.suffix:
            draw_front.text(
                (1390, 740),
                parent.suffix,
                fill='black',
                font=ImageFont.truetype('arial.ttf', size=52)
            )

        draw_front.text(
            (480, 355),
            parent.uuid,
            fill='black',
            font=ImageFont.truetype('arialbd.ttf', size=52)
        )

        draw_front.text(
            (1150, 890),
            str(parent.birthday),
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )

        with picture.resize((560, 560)) as picture:
            id_front.paste(picture, (290, 430))

        with signature.resize((350, 350)).convert('RGBA') as signature:
            signature_pixels = signature.getdata()
            white_pixels = []

            for item in signature_pixels:  
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
                    white_pixels.append((255, 255, 255, 0))
                else:
                    white_pixels.append(item)
            signature.putdata(white_pixels)

            id_front.paste(signature, (400, 950), signature)

        return id_front

def generate_id_back(parent, contact):
    id_back = Image.open(f"{settings.BASE_DIR}/api/static/id-back.png")
    
    with id_back as id_back:
        draw_back = ImageDraw.Draw(id_back)

        draw_back.text(
            (400, 200),
            " ".join(
                str(part)
                for part in [
                    parent.house,
                    f"{parent.street},",
                    f"{parent.barangay},",
                    f"{parent.subdivision},",
                    f"{parent.city},",
                    parent.province,
                ] if part
            ),
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )

        draw_back.text(
            (800, 380),
            " ".join(
                str(part)
                for part in [
                    f"{contact.last_name},",
                    contact.first_name,
                    contact.middle_name,
                    contact.suffix,
                ] if part
            ),
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )
        draw_back.text(
            (860, 610),
            str(contact.phone),
            fill='black',
            font=ImageFont.truetype('arial.ttf', size=52)
        )

        return id_back

def image_to_base64(image):
    bytes = io.BytesIO()
    image.save(bytes, format='PNG')
    return base64.b64encode(bytes.getvalue()).decode('utf-8')