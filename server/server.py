from flask import Flask, jsonify, request
from flask_cors import cross_origin, CORS
import json
from bson import json_util
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
from measure import measure_angle

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = './uploads'

# 키값 호출
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

# MONGO DB
client = MongoClient(MONGO_URI)
db = client.get_database('data')


# @app.route('/api', methods=['GET'])
# @cross_origin()
# def root():
#     db.hits.insert_one({'time': datetime.utcnow()})
#     response = jsonify(
#         message='This page has been visited {} times.'.format(db.hits.count()))
#     return response


@app.route('/api/posture', methods=['POST'])
def analyze_image():
    # 이미지 파일 저장
    image_file = request.files['file']
    filename = secure_filename(image_file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    image_file.save(filepath)

    # 관절 번호: 머리는 0, 목은 1 등등
    BODY_PARTS = {"Head": 0, "Neck": 1, "RShoulder": 2, "RElbow": 3, "RWrist": 4,
                  "LShoulder": 5, "LElbow": 6, "LWrist": 7, "RHip": 8, "RKnee": 9,
                  "RAnkle": 10, "LHip": 11, "LKnee": 12, "LAnkle": 13, "Chest": 14,
                  "Background": 15}

    # 관절들을 선으로 이을 때 쌍이 되는 것들
    POSE_PAIRS = [["RShoulder", "LShoulder"], ["LShoulder", "LHip"], ["LHip", "RHip"],
                  ["RHip", "RShoulder"], ["RHip", "RKnee"], ["RKnee", "RAnkle"],
                  ["LHip", "LKnee"], ["LKnee", "LAnkle"]]

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

        # 키포인트 검출한 결과가 0.1보다 크면(검출한곳이 위 BODY_PARTS랑 맞는 부위면) points에 추가, 검출했는데 부위가 없으면 -1,-1으로
        if prob > 0.1:
            points.append([int(x), int(y)])
        else:
            points.append([-1, -1])

    # 이미지 복사
    imageCopy = image

    # 각 랜드마크끼리 선 그어줌 (위에 잇고싶은 랜드마크 쌍만 연결)
    for pair in POSE_PAIRS:
        partA = pair[0]             # Head
        partA = BODY_PARTS[partA]   # 0
        partB = pair[1]             # Neck
        partB = BODY_PARTS[partB]   # 1

        #print(partA," 와 ", partB, " 연결\n")
        if points[partA] and points[partB]:
            if points[partB] == [-1, -1]:
                continue
            else:
                cv2.line(imageCopy, points[partA],
                         points[partB], (255, 0, 0), 1)

    # 표시하고싶은 랜드마크
    arr = [1, 2, 5, 8, 9, 10, 11, 12, 13]

    # 표시하고싶은 랜드마크에 점 찍기
    for i in arr:
        if (points[i] == [-1, -1]):
            continue
        else:
            # circle(그릴곳, 원의 중심, 반지름, 색)
            cv2.circle(image, (points[i][0], points[i][1]), 3,
                       (0, 0, 255), thickness=-1, lineType=cv2.FILLED)
            # cv2.putText(image, "{}".format(i), (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, lineType=cv2.LINE_AA)

    # 목과의 각도를 구하기 위해 양 어께의 중간 좌표 구하기
    ms_x = round((points[2][0] + points[5][0])/2)
    ms_y = round((points[2][1] + points[5][1])/2)

    points.append([ms_x, ms_y])   # points배열의 15번째에 들어감

    cv2.line(imageCopy, points[15], points[1],
             (255, 0, 0), 1)   # 어께의 중간과 목을 선으로 잇기

    cv2.imwrite('./uploads/cv2_image.png', imageCopy)
    image_path = get_image_path('./uploads/cv2_image.png')

    wk_angle, wk_message, n_angle, n_message = measure_angle(points)
    # DB 저장
    db.result.insert_one({'image_path': image_path, "wk_angle": wk_angle,
                         "wk_message": wk_message,  "n_angle": n_angle, "n_message": n_message, 'time': datetime.now().replace(microsecond=0).isoformat()})

    return jsonify({'image_path': image_path, "wk_angle": wk_angle, "wk_message": wk_message,  "n_angle": n_angle, "n_message": n_message})


@app.route('/api/result', methods=['GET'])
def get_result():
    result = list(db.result.find())
    user = list(db.users.find({'email': 'test@abc.com'}))
    print(user)
    print(len(user))
    return json.dumps(result, default=json_util.default)


if __name__ == '__main__':
    # only used locally
    app.run(host='0.0.0.0', port=5000, debug=True)
