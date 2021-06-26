import numpy as np
import csv


def measure_angle(points):

    # default : s - 오른쪽 어께 h - 오른쪽 골반 k - 오른쪽 무릎 각각의 x, y좌표로 배열 생성
    s = np.array([points[2][0], points[2][1]])
    h = np.array([points[8][0], points[8][1]])
    k = np.array([points[9][0], points[9][1]])

    if (h[0] < k[0]):     # 오른쪽에서 찍은 사진일 때
        # 골반-어께의 각도
        w_radian = np.arctan2(s[1] - h[1], s[0] - h[0])
        w_angle = round(np.abs(w_radian*180.0/np.pi))

        # 골반-무릎의 각도
        k_radian = np.arctan2(k[1] - h[1], k[0] - h[0])
        k_angle = round(np.abs(k_radian*180.0/np.pi))

        # 각도 설정
        if(h[1] < k[1]):    # 무릎이 골반보다 낮을 때
            angle = np.abs(w_angle)
        else:               # 무릎이 골반보다 높을 때
            angle = np.abs(w_angle - k_angle)

        wk_angle = angle

    else:                 # 왼쪽에서 찍은 사진일 때
        s = np.array([points[5][0], points[5][1]])
        h = np.array([points[11][0], points[11][1]])
        k = np.array([points[12][0], points[12][1]])

        # 골반-어께의 각도
        w_radian = np.arctan2(s[1] - h[1], s[0] - h[0])
        w_angle = round(np.abs(w_radian*180.0/np.pi))

        # 골반-무릎의 각도
        k_radian = np.arctan2(k[1] - h[1], k[0] - h[0])
        k_angle = round(np.abs(k_radian*180.0/np.pi))

        # 각도 설정
        if(h[1] < k[1]):    # 무릎이 골반보다 낮을 때
            angle = np.abs(180 - w_angle)
        else:             # 무릎이 골반보다 높을 때
            angle = np.abs(k_angle - w_angle)

        wk_angle = angle

    # 허리 각도로 자세 판단(데이터가 쌓이기 전까지 이 방식으로 표현)
    if 95 <= wk_angle <= 125:
        wk_message = "올바른 자세입니다. 계속 유지하세요!!!."
    elif wk_angle > 125:
        wk_message = "의자를 당겨 엉덩이를 밀착시켜주세요! 장시간 뒤로 젖힌 자세는 척추건강에 좋지 않습니다. "
    else:
        wk_message = "허리를 펴주세요! 구부정한 자세는 허리디스크의 원인이 됩니다."

    # n - 목 ms - 어께의 중앙
    n = np.array([points[1][0], points[1][1]])
    ms = np.array([points[15][0], points[15][1]])

    # 목-어께중앙의 각도
    n_radian = np.arctan2(n[1] - ms[1], n[0] - ms[0])
    n_angle = round(np.abs(n_radian*180.0/np.pi))

    # 각도 설정
    if(h[0] < k[0]):    # 오른쪽에서 찍었을 때
        n_angle = np.abs(n_angle)
    elif(h[0] > k[0]):  # 왼쪽에서 찍었을 때
        n_angle = np.abs(180 - n_angle)

    # 목 각도로 자세 판단(데이터가 쌓이기 전까지 이 방식으로 표현)
    if 80 <= n_angle <= 100:
        n_message = "올바른 자세입니다. 계속 유지하세요!!!"
    elif n_angle > 100:
        n_message = "턱을 앞으로 당겨주세요! 어깨와 허리건강에 좋지 않습니다."
    else:
        n_message = "턱을 뒤로 당겨주세요! 거북목의 원인이 될 수 있습니다. "

    with open('./uploads/Landmark_Datas.csv', 'a', newline='') as f:
        wr = csv.writer(f)
        wr.writerow([wk_angle, n_angle])
        f.close

    print(n_message)
    return str(wk_angle), wk_message, str(n_angle), n_message
