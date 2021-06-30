import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

body = pd.read_csv(
    '.uploads/Landmark_Datas.csv')  # CSV파일을 불러옵니다


df = body  # 불러온 csv를 df라는 변수에 저장합니다

x = df[['Age', 'Sex']]  # x변수에 나이와 성별을 지정합니다
y = df[['Angle(neck)']]  # y 변수에 angle_neck를 지정합니다

# x_train과 x_test, y도 같이 8대2의 값으로 나눠줍니다.
x_train, x_test, y_train, y_test = train_test_split(
    x, y, train_size=0.8, test_size=0.2)

# sklearn.linear_model을 이용해 모델을 생성해줍니다
mlr = LinearRegression()
mlr.fit(x_train, y_train)


ex_body = [[25, 0]]  # 하나의 예시를 넣어주면

# x_test를 넣어 예측한 y 값들을 y_predict라고 저장해보자. 추후에 시험 데이터에 있는 실제 정답, 즉 y_test와 비교해보기 위함이다.
my_predict = mlr.predict(ex_body)
y_predict = mlr.predict(x_test)


# x는 실측치이며 y축은 예측치입니다.
# 만약 정답을 맞춘다면 그래프가 선형을 띌 것입니다.
plt.scatter(y_test, y_predict, alpha=0.4)
plt.xlabel("Actual")
plt.ylabel("Predicted")
plt.title("MULTIPLE LINEAR REGRESSION")
#plt.show()
# 회귀계수
print(mlr.coef_)

# x와 y의 상관성을 그래프로 확인해봅니다.
plt.scatter(df[['Age']], df[['Angle(neck)']], alpha=0.4)
plt.show()
plt.scatter(df[['Sex']], df[['Angle(neck)']], alpha=0.4)
#plt.show()

# 결정계수 R² 1에 가까울수록 정답 70 이상 되어야 쓸만하다고 합니다.
print(mlr.score(x_train, y_train))
# %% y = back
x = df[['Age', 'Sex']]
y = df[['Angle(back)']]

x_train, x_test, y_train, y_test = train_test_split(
    x, y, train_size=0.8, test_size=0.2)

mlr = LinearRegression()
mlr.fit(x_train, y_train)

ex_body = [[25, 0]]
my_predict = mlr.predict(ex_body)
y_predict = mlr.predict(x_test)

plt.scatter(y_test, y_predict, alpha=0.4)
plt.xlabel("Actual")
plt.ylabel("Predicted")
plt.title("MULTIPLE LINEAR REGRESSION")
#plt.show()
print(mlr.coef_)

plt.scatter(df[['Age']], df[['Angle(back)']], alpha=0.4)
#plt.show()
plt.scatter(df[['Sex']], df[['Angle(back)']], alpha=0.4)
#plt.show()

print('상관관계는', mlr.score(x_train, y_train))

# %%
# test와 train의 표본을 8대 2로 랜덤으로 잡아주기 때문에 돌릴때마다 결정계수가 달라집니다. 따라서 100번 돌린 평균을 구하는 코드를 추가해주었습니다.

a = []
b = []
for i in range(0, 100):
    x = df[['Age', 'Sex']]  # x변수에 나이와 성별을 지정합니다
    y = df[['Angle(neck)']]  # y 변수에 angle_neck를 지정합니다

    # x_train과 x_test, y도 같이 8대2의 값으로 나눠줍니다.
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, train_size=0.8, test_size=0.2)

    # sklearn.linear_model을 이용해 모델을 생성해줍니다
    mlr = LinearRegression()
    mlr.fit(x_train, y_train)

    ex_body = [[25, 0]]  # 하나의 예시를 넣어주면

    # x_test를 넣어 예측한 y 값들을 y_predict라고 저장해보자. 추후에 시험 데이터에 있는 실제 정답, 즉 y_test와 비교해보기 위함이다.
    my_predict = mlr.predict(ex_body)
    y_predict = mlr.predict(x_test)

    # 결정계수 R² 1에 가까울수록 정답 70 이상 되어야 쓸만하다고 합니다.
    a.append(mlr.score(x_train, y_train))

    x = df[['Age', 'Sex']]  # x변수에 나이와 성별을 지정합니다
    y = df[['Angle(back)']]  # y 변수에 angle_neck를 지정합니다

    # x_train과 x_test, y도 같이 8대2의 값으로 나눠줍니다.
    x_train, x_test, y_train, y_test = train_test_split(
        x, y, train_size=0.8, test_size=0.2)

    # sklearn.linear_model을 이용해 모델을 생성해줍니다
    mlr = LinearRegression()
    mlr.fit(x_train, y_train)

    ex_body = [[25, 0]]  # 하나의 예시를 넣어주면

    # x_test를 넣어 예측한 y 값들을 y_predict라고 저장해보자. 추후에 시험 데이터에 있는 실제 정답, 즉 y_test와 비교해보기 위함이다.
    my_predict = mlr.predict(ex_body)
    y_predict = mlr.predict(x_test)

    # 결정계수 R² 1에 가까울수록 정답 70 이상 되어야 쓸만하다고 합니다.
    b.append(mlr.score(x_train, y_train))

print('neck의 결정계수는', sum(a)/len(a), '입니다')
print('back의 결정계수는', sum(b)/len(b), '입니다')
