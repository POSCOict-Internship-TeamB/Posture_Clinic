
from flask import request
import numpy as np
import urllib
import matplotlib.pyplot as plt
import matplotlib.patches as patches


def measure_angle_url(response, image_url):

    # 랜드마크 좌표를 배열 형식으로 정리([x, y, 신뢰도]순서)
    keypoints = np.array(response[0]['keypoints']).reshape((-1, 3))

    # scientific notation(과학적 표기법(너무 크거나 작은 숫자들을 십진법으로 표현하는 방법)) 제거
    np.set_printoptions(suppress=True)

    # x - 오른쪽 어께 y - 오른쪽 골반 z - 오른쪽 무릎 각각의 x, y좌표로 배열 생성
    x = np.array([keypoints[6][0], keypoints[6][1]])
    y = np.array([keypoints[12][0], keypoints[12][1]])
    z = np.array([keypoints[14][0], keypoints[14][1]])

    # 골반-어께의 각도
    w_radian = np.arctan2(x[1] - y[1], x[0] - y[0])
    w_angle = round(np.abs(w_radian*180.0/np.pi), 0)

    # 골반-무릎의 각도
    k_radian = np.arctan2(x[1] - y[1], x[0] - y[0])
    k_angle = round(np.abs(k_radian*180.0/np.pi), 0)

    # 각도 설정
    if(y[0] < z[0] and y[1] < z[1]):    # 오른쪽에서 찍고 무릎이 골반보다 낮을때
        posture_angle = np.abs(w_angle)
    elif(y[0] < z[0] and y[1] > z[1]):  # 오른쪽에서 찍고 무릎이 골반보다 높을때
        posture_angle = np.abs(w_angle - k_angle)
    elif(y[0] > z[0] and y[1] < z[1]):  # 왼쪽에서 찍고 무릎이 골반보다 낮을때
        posture_angle = np.abs(180 - w_angle)
    else:                                # 왼쪽에서 찍고 무릎이 골반보다 높을때
        posture_angle = np.abs(k_angle - w_angle)

    # 각도 출력
    print(posture_angle)

    # 각도로 자세 판단(데이터가 쌓이기 전까지 이 방식으로 표현)
    if 85 <= posture_angle <= 95:
        message = "자세가 올바릅니다."
    elif posture_angle > 95:
        message = "뒤로 기울었습니다."
    else:
        message = "앞으로 기울었습니다."

    fig, ax = plt.subplots(figsize=(20, 20))

    f = urllib.request.urlopen(image_url)
    img = plt.imread(f, format='jpg | png | jpeg')

    x, y, w, h = response[0]['bbox']

    # 랜드마크 주변에 사각형 그리기
    rect = patches.Rectangle((x, y), w, h, linewidth=2,
                             edgecolor='r', facecolor='none')
    ax.add_patch(rect)

    # 이을 랜드마크끼리 묶기
    skeleton = [
        # [5, 7, 9], # 왼팔
        # [6, 8, 10], # 오른팔
        [11, 13, 15],  # 왼쪽 골반-무릎-발목
        [12, 14, 16],  # 오른쪽 골반-무릎-발목
        [5, 6, 12, 11, 5],  # 몸통
        [5, 3],  # 왼쪽 어께-왼쪽 귀
        [6, 4]  # 오른쪽 어께-오른쪽 귀
    ]

    # 랜드마크에 점 찍고 선으로 잇기
    for sk in skeleton:
        coords = np.take(keypoints, sk, axis=0)
        ax.plot(coords[:, 0], coords[:, 1],
                marker='o', linewidth=3, markersize=10)

    ax.imshow(img)
    # 축 숨기기
    plt.axis('off')
    # body.png로 저장
    plt.savefig('./uploads/body.png')

    return posture_angle, message


def measure_angle_file(response):

    # 랜드마크 좌표를 배열 형식으로 정리([x, y, 신뢰도]순서)
    keypoints = np.array(response[0]['keypoints']).reshape((-1, 3))

    # scientific notation(과학적 표기법(너무 크거나 작은 숫자들을 십진법으로 표현하는 방법)) 제거
    np.set_printoptions(suppress=True)

    # x - 오른쪽 어께 y - 오른쪽 골반 z - 오른쪽 무릎 각각의 x, y좌표로 배열 생성
    x = np.array([keypoints[6][0], keypoints[6][1]])
    y = np.array([keypoints[12][0], keypoints[12][1]])
    z = np.array([keypoints[14][0], keypoints[14][1]])

    # 골반-어께의 각도
    w_radian = np.arctan2(x[1] - y[1], x[0] - y[0])
    w_angle = round(np.abs(w_radian*180.0/np.pi), 0)

    # 골반-무릎의 각도
    k_radian = np.arctan2(x[1] - y[1], x[0] - y[0])
    k_angle = round(np.abs(k_radian*180.0/np.pi), 0)

    # 각도 설정
    if(y[0] < z[0] and y[1] < z[1]):    # 오른쪽에서 찍고 무릎이 골반보다 낮을때
        posture_angle = np.abs(w_angle)
    elif(y[0] < z[0] and y[1] > z[1]):  # 오른쪽에서 찍고 무릎이 골반보다 높을때
        posture_angle = np.abs(w_angle - k_angle)
    elif(y[0] > z[0] and y[1] < z[1]):  # 왼쪽에서 찍고 무릎이 골반보다 낮을때
        posture_angle = np.abs(180 - w_angle)
    else:                                # 왼쪽에서 찍고 무릎이 골반보다 높을때
        posture_angle = np.abs(k_angle - w_angle)

    # 각도 출력
    print(posture_angle)

    # 각도로 자세 판단(데이터가 쌓이기 전까지 이 방식으로 표현)
    if 85 <= posture_angle <= 95:
        message = "자세가 올바릅니다."
    elif posture_angle > 95:
        message = "뒤로 기울었습니다."
    else:
        message = "앞으로 기울었습니다."

    # fig, ax = plt.subplots(figsize=(20, 20))

    # f = urllib.request.urlopen(image_url)
    # img = plt.imread(f, format='jpg | png | jpeg')

    # x, y, w, h = response[0]['bbox']

    # # 랜드마크 주변에 사각형 그리기
    # rect = patches.Rectangle((x, y), w, h, linewidth=2,
    #                          edgecolor='r', facecolor='none')
    # ax.add_patch(rect)

    # # 이을 랜드마크끼리 묶기
    # skeleton = [
    #     # [5, 7, 9], # 왼팔
    #     # [6, 8, 10], # 오른팔
    #     [11, 13, 15],  # 왼쪽 골반-무릎-발목
    #     [12, 14, 16],  # 오른쪽 골반-무릎-발목
    #     [5, 6, 12, 11, 5],  # 몸통
    #     [5, 3],  # 왼쪽 어께-왼쪽 귀
    #     [6, 4]  # 오른쪽 어께-오른쪽 귀
    # ]

    # # 랜드마크에 점 찍고 선으로 잇기
    # for sk in skeleton:
    #     coords = np.take(keypoints, sk, axis=0)
    #     ax.plot(coords[:, 0], coords[:, 1],
    #             marker='o', linewidth=3, markersize=10)

    # ax.imshow(img)
    # # 축 숨기기
    # plt.axis('off')
    # # body.png로 저장
    # plt.savefig('./uploads/body.png')

    return posture_angle, message
