from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS
from pymongo import MongoClient
from datetime import datetime
import numpy as np
import requests
import math
import urllib
from requests import Session
# import matplotlib.pyplot as plt
# import matplotlib.patches as patches


app = Flask(__name__)
CORS(app)

client = MongoClient(
    "mongodb+srv://admin:1234@poscoict-internship-tea.pjwph.mongodb.net/test?authSource=admin&replicaSet=atlas-x4q3t7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true")
db = client.get_database('test')


@app.route('/api', methods=['GET'])
@cross_origin()
def root():
    db.hits.insert_one({'time': datetime.utcnow()})
    response = jsonify(
        message='This page has been visited {} times.'.format(db.hits.count()))
    return response


@app.route('/api/posture', methods=['GET'])
def get_angle():
    app_key = 'KakaoAK c74e0212de19b5331ac4878b860f71a9'

    url = 'https://cv-api.kakaobrain.com/pose'

    data = {
        'image_url': 'https://funshop.akamaized.net/products/0000071720/20190725_01_02.jpg?00000001564039634'
    }

    headers = {
        'Authorization': app_key
    }

    res = requests.post(url, data=data, headers=headers).json()

    keypoints = np.array(res[0]['keypoints']).reshape((-1, 3))

    # scientific notation(과학적 표기법(너무 크거나 작은 숫자들을 십진법으로 표현하는 방법)) 제거
    np.set_printoptions(suppress=True)

    x = np.array([keypoints[6][0], keypoints[6][1]])
    y = np.array([keypoints[12][0], keypoints[12][1]])
    z = np.array([keypoints[14][0], keypoints[14][1]])

    if(y[1] < z[1]):          # 무릎이 지면과 수평이 아닐 때
        # 어깨-엉덩이 벡터와 y = (엉덩이의 y좌표 값)벡터의 각도
        radian = np.arctan2(x[1] - y[1], x[0] - y[0])
    else:
        # 어깨-엉덩이 벡터와 엉덩이-무릎 벡터의 각도
        radian = np.arctan2(z[1] - y[1], z[0] - y[0]) - \
            np.arctan2(x[1] - y[1], x[0] - y[0])

    # 각도를 절대값으로 바꾸고 소수점 첫째자리에서 반올림
    angle = round(np.abs(radian*180.0/np.pi), 0)

    return jsonify({'angle': angle, "res": res})


@app.route('/api/postureImage', methods=['POST'])
def get_image():
    app_key = 'c74e0212de19b5331ac4878b860f71a9'
    print(request.files['data'])
    image_file = request.files['data']
    session = requests.Session()
    session.headers.update({'Authorization': 'KakaoAK' + app_key})

    with open(image_file, 'rb') as f:
        response = session.post(
            'https://cv-api.kakaobrain.com/pose', files={'file', f})
        print(response.status_code, response.json())
        return response


"""
파일로 읽어오는 코드
app_key = 'c74e0212de19b5331ac4878b860f71a9'
image_file = 'body.jpg'
session = requests.Session()
session.headers.update({'Authorization': 'KakaoAK' + app_key})

with open(image_file, 'rb') as f:
    response = session.post('https://cv-api.kakaobrain.com/pose', files = [('file', f)])
    print(response.status_code, response.json())
"""


if __name__ == '__main__':
    # only used locally
    app.run(host='0.0.0.0', port=5000, debug=True)
