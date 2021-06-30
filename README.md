# **Welcome to Posture-Clinic👩‍💻**

AI 기반 모션인식을 통한 자세교정 솔루션 **Posture-Clinic** 입니다

# **Preview**

![preview](client/public/preview1.gif)
![preview](client/public/preview2.gif)

# **How to start**

1. Clone

   ```bash
   git clone https://github.com/POSCOict-Internship-TeamB/Posture_Clinic.git
   ```

2. Creat .env file in server folder

   ```bash
   MONGO_URI = 'mongodb+srv://ID:PW@poscoict-internship-tea.pjwph.mongodb.net/test?authSource=admin&replicaSet=atlas-x4q3t7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true'

   ```

3. VS Code 터미널에 입력
   `docker-compose up --build`
   Then, you can access to your server http://localhost:3000

# **Technology stack**

### Architecture

![Architecture](client/public/architecture.png)

### Tech Stack

- Front-end

    <img src="https://img.shields.io/badge/react.js-61DAFB?style=for-the-badge&logo=react&logoColor=black">
    <img src="https://img.shields.io/badge/html-E34F26?style=for-the-badge&logo=html5&logoColor=white"> 
    <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
    <img src="https://img.shields.io/badge/StyledComponents-DB7093?style=for-the-badge&logo=styled-components&logoColor=white">
    <img src="https://img.shields.io/badge/Antdesign-0170FE?style=for-the-badge&logo=AntDesign&logoColor=white">

- Back-end

    <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=OpenCV&logoColor=white">
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white">
    <img src="https://img.shields.io/badge/Mongo DB-47A248?style=for-the-badge&logo=MongoDB&logoColor=white">

- Server

    <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=Nginx&logoColor=black">
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=black">

- ETC

    <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
    <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white">

### Directory

- client

```bash
 |-Dockerfile
  |-jsconfig.json
  |-package-lock.json
  |-package.json
  |-public
  |  |-architecture.png
  |  |-favicon.ico
  |  |-index.html
  |  |-mainlogo.png
  |  |-manifest.json
  |  |-neck.png
  |  |-posture.png
  |  |-sit.png
  |-setupProxy.js
  |-src
  |  |-App.js
  |  |-components
  |  |  |-BaseComponents.js
  |  |  |-Layout
  |  |  |  |-FooterLayout.js
  |  |  |  |-SiderLayout.js
  |  |-Config.js
  |  |-index.css
  |  |-index.js
  |  |-lib
  |  |  |-styles
  |  |  |  |-index.js
  |  |  |  |-stylesheet
  |  |  |  |  |-alignChild.js
  |  |  |  |  |-alignSelf.js
  |  |  |  |  |-index.js
  |  |  |  |  |-mediaQuery.js
  |  |  |  |  |-pad.js
  |  |  |  |  |-round.js
  |  |  |  |  |-size.js
  |  |  |  |  |-spacing.js
  |  |  |  |  |-typo.js
  |  |  |  |-values.js
  |  |-pages
  |  |  |-Dashboard
  |  |  |  |-Dashboard.js
  |  |  |  |-ResultModal.js
  |  |  |-Login
  |  |  |  |-Login.js
  |  |  |-Posture
  |  |  |  |-index.js
  |  |  |  |-MeasureImage.js
  |  |  |  |-MeasureVideo.js
  |  |-serviceWorker.js
```

- server

```bash
  |-.env
  |-.gitignore
  |-Dockerfile
  |-image.py
  |-measure.py
  |-pose_deploy_linevec.prototxt
  |-pose_iter_160000.caffemodel
  |-requirements.txt
  |-server.py
  |-uploads
  |  |-cv2_image.png
  |  |-Landmark_Datas.csv
  |  |-posture.png
```

# **Team members**

- 박현우 (https://github.com/parkhj0423)
- 이가은 (https://github.com/Lee-Ga-eun)
- 김병근 (https://github.com/kimbyeonggeun)
- 이미영 (https://github.com/MiMi012)
- 신재관 (https://github.com/Jaegwan-Shin)
