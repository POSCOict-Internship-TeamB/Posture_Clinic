import base64

def get_image_path(filepath):
    f = open(filepath, 'rb')
    base64_str = base64.b64encode(f.read()).decode('utf8')
    return base64_str
