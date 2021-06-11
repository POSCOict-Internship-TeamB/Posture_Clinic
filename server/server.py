from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS
from pymongo import MongoClient
from datetime import datetime
import requests
import math
from requests import Session
import os
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

import numpy as np


from measure import measure_angle_url, measure_angle_file

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = './uploads'

IMAGE_FILE_PATH = './uploads/123123123.png'

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
KAKAO_APP_KEY = os.getenv("KAKAO_APP_KEY")
KAKAO_URL = os.getenv("KAKAO_URL")

client = MongoClient(MONGO_URI)
db = client.get_database('test')


@app.route('/api', methods=['GET'])
@cross_origin()
def root():
    db.hits.insert_one({'time': datetime.utcnow()})
    response = jsonify(
        message='This page has been visited {} times.'.format(db.hits.count()))
    return response


@app.route('/api/posture-url', methods=['GET'])
def get_angle():

    data = {
        'image_url': 'http://ncc.phinf.naver.net/20141017_225/1413512182571B2Vuy_JPEG'
        # 예시1) https://www.sisajournal.com/news/photo/201906/187672_92169_1529.jpg
        # 예시2) http://ncc.phinf.naver.net/20141017_225/1413512182571B2Vuy_JPEG
        # 예시3) https://previews.123rf.com/images/endomedion/endomedion1411/endomedion141100016/33515699-%EC%98%AC%EB%B0%94%EB%A5%B8-%EC%95%89%EC%9D%80-%EC%9E%90%EC%84%B8%EC%97%90%EC%84%9C-%EC%9D%98%EC%9E%90%EC%97%90-%EB%B9%84%EC%A6%88%EB%8B%88%EC%8A%A4-%EB%82%A8%EC%9E%90-%ED%9C%B4%EC%8B%9D.jpg
    }

    headers = {
        'Authorization': KAKAO_APP_KEY
    }

    response = requests.post(KAKAO_URL, data=data, headers=headers).json()
    # 각도산출
    angle, message = measure_angle_url(response, data['image_url'])

    return jsonify({'angle': angle,  "message": message})


@app.route('/api/posture-file', methods=['POST'])
def get_image():
    image_file = request.files['file']
    filename = secure_filename(image_file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(filepath)

    session = requests.Session()
    session.headers.update({'Authorization': KAKAO_APP_KEY})

    # IMAGE_FILE_PATH 를 filepath로 바꾸면 웹캠을 통해 캡쳐한 이미지 분석
    with open(filepath, 'rb') as f:
        response = session.post(KAKAO_URL, files=[('file', f)]).json()

        angle, message = measure_angle_file(response)

        return jsonify({'angle': angle, 'message': message})


if __name__ == '__main__':
    # only used locally
    app.run(host='0.0.0.0', port=5000, debug=True)
