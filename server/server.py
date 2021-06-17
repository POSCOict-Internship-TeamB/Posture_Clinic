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
import cv2

from image import get_image_path
from measure import measure_angle_url, measure_angle_file

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = './uploads'

# 키값 호출
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
KAKAO_APP_KEY = os.getenv("KAKAO_APP_KEY")
KAKAO_URL = os.getenv("KAKAO_URL")

# MONGO DB
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

    with open(filepath, 'rb') as f:
        response = session.post(KAKAO_URL, files=[('file', f)]).json()

        angle, message = measure_angle_file(response, filepath)

        image_path = get_image_path('./uploads/landmark.png')

        return jsonify({'angle': angle, 'message': message, 'image_path': image_path})


@app.route('/api/posture-opencv', methods=['POST'])
def use_opencv():

    # MPII에서 각 파트 번호, 선으로 연결될 POSE_PAIRS
    BODY_PARTS = {"RShoulder": 2,
                  "LShoulder": 5, "RHip": 8, "RKnee": 9,
                  "RAnkle": 10, "LHip": 11, "LKnee": 12, "LAnkle": 13,
                  }

    POSE_PAIRS = [
        ["RShoulder", "RHip"], ["RHip", "RKnee"],
        ["RKnee", "RAnkle"], ["LShoulder", "LHip"], ["LHip", "LKnee"], ["LKnee", "LAnkle"]]

    # 각 파일 path
    protoFile = "./pose_deploy_linevec.prototxt"
    weightsFile = "./pose_iter_160000.caffemodel"

    # 위의 path에 있는 network 불러오기
    net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)

    # 이미지 읽어오기
    image = cv2.imread(
        "./uploads/posture.png")

    # frame.shape = 불러온 이미지에서 height, width, color 받아옴
    imageHeight, imageWidth, _ = image.shape

    # network에 넣기위해 전처리
    inpBlob = cv2.dnn.blobFromImage(
        image, 1.0 / 255, (imageWidth, imageHeight), (0, 0, 0), swapRB=False, crop=False)

    # network에 넣어주기
    net.setInput(inpBlob)

    # 결과 받아오기
    output = net.forward()

    # output.shape[0] = 이미지 ID, [1] = 출력 맵의 높이, [2] = 너비
    H = output.shape[2]
    W = output.shape[3]
    print("이미지 ID : ", len(output[0]), ", H : ",
          output.shape[2], ", W : ", output.shape[3])  # 이미지 ID

    # 키포인트 검출시 이미지에 그려줌
    points = []
    for i in range(0, 15):
        # 해당 신체부위 신뢰도 얻음.
        probMap = output[0, i, :, :]

        # global 최대값 찾기
        minVal, prob, minLoc, point = cv2.minMaxLoc(probMap)

        # 원래 이미지에 맞게 점 위치 변경
        x = (imageWidth * point[0]) / W
        y = (imageHeight * point[1]) / H

        # 키포인트 검출한 결과가 0.1보다 크면(검출한곳이 위 BODY_PARTS랑 맞는 부위면) points에 추가, 검출했는데 부위가 없으면 None으로
        if prob > 0.1:
            cv2.circle(image, (int(x), int(y)), 3, (0, 255, 255), thickness=-1,
                       lineType=cv2.FILLED)       # circle(그릴곳, 원의 중심, 반지름, 색)
            cv2.putText(image, "{}".format(i), (int(x), int(
                y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1, lineType=cv2.LINE_AA)
            points.append((int(x), int(y)))
        else:
            points.append(None)

    # 이미지 복사
    imageCopy = image

    # 각 POSE_PAIRS별로 선 그어줌 (머리 - 목, 목 - 왼쪽어깨, ...)
    for pair in POSE_PAIRS:
        partA = pair[0]             # Head
        partA = BODY_PARTS[partA]   # 0
        partB = pair[1]             # Neck
        partB = BODY_PARTS[partB]   # 1

        #print(partA," 와 ", partB, " 연결\n")
        if points[partA] and points[partB]:
            cv2.line(imageCopy, points[partA], points[partB], (0, 255, 0), 2)

    cv2.imwrite('./uploads/cv2_image.png', imageCopy)
    image_path = get_image_path('./uploads/cv2_image.png')

    # x - 오른쪽 어께 y - 오른쪽 골반 z - 오른쪽 무릎 각각의 x, y좌표로 배열 생성
    x = np.array([points[2][0], points[2][1]])
    y = np.array([points[8][0], points[8][1]])
    z = np.array([points[9][0], points[9][1]])

    # 골반-어께의 각도
    w_radian = np.arctan2(x[1] - y[1], x[0] - y[0])
    w_angle = round(np.abs(w_radian*180.0/np.pi), 0)

    # 골반-무릎의 각도
    k_radian = np.arctan2(z[1] - y[1], z[0] - y[0])
    k_angle = round(np.abs(k_radian*180.0/np.pi), 0)

    # 각도 설정
    if(y[0] < z[0] and y[1] < z[1]):    # 오른쪽에서 찍고 무릎이 골반보다 낮을때
        angle = np.abs(w_angle)
    elif(y[0] < z[0] and y[1] > z[1]):  # 오른쪽에서 찍고 무릎이 골반보다 높을때
        angle = np.abs(w_angle - k_angle)
    elif(y[0] > z[0] and y[1] < z[1]):  # 왼쪽에서 찍고 무릎이 골반보다 낮을때
        angle = np.abs(180 - w_angle)
    else:                                # 왼쪽에서 찍고 무릎이 골반보다 높을때
        angle = np.abs(k_angle - w_angle)

    # 각도 출력
    print(angle)

    # 각도로 자세 판단(데이터가 쌓이기 전까지 이 방식으로 표현)
    if 85 <= angle <= 95:
        message = "좋습니다."
    elif angle > 95:
        message = "뒤로 기울었습니다."
    else:
        message = "앞으로 기울었습니다."

    return jsonify({'image_path': image_path, "angle": angle, "message": message})


if __name__ == '__main__':
    # only used locally
    app.run(host='0.0.0.0', port=5000, debug=True)
