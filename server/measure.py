from flask import request
import numpy as np
import urllib
import matplotlib.pyplot as plt
import matplotlib.patches as patches


def measure_angle(points):

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

    return angle, message
