import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button, Spin, Steps } from "antd";
import axios from "axios";
import styled from "@emotion/styled";
import {
  CameraOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";

const { Step } = Steps;

const Img = styled.img`
  width: 622px;
  height: 350px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  width: 150px;
  height: 50px;
  border-radius: 10px;
  margin: 1rem auto;
`;

const StyledSpin = styled(Spin)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const steps = [
  {
    title: <b>Image Capture</b>,
    icon: <VideoCameraAddOutlined />,
  },
  {
    title: <b>Check Image</b>,
    icon: <CameraOutlined />,
  },
  {
    title: <b>Analyze Image</b>,
    icon: <LoadingOutlined />,
  },
  {
    title: <b>Result</b>,
    icon: <CheckCircleOutlined />,
  },
];

function Posture() {
  const webcamRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [angle, setAngle] = useState("");
  const [message, setMessage] = useState("");
  const [measuredImage, setMeasuredImage] = useState("");

  const videoConstraints = {
    width: "622",
    height: "350",
    facingMode: "user",
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const capture = useCallback(() => {
    const capturedImg = webcamRef.current.getScreenshot();
    setImgSrc(capturedImg);
    setCurrent(current + 1);
    console.log(capturedImg);
  }, [webcamRef, setImgSrc]);

  const analyzeImage = () => {
    const data = new FormData();
    const file = dataURItoBlob(imgSrc);
    data.append("file", file, "posture.png");
    setLoading(true);
    setCurrent(current + 1);

    axios.post("http://localhost:5000/api/posture", data).then((response) => {
      if (response.data) {
        setLoading(false);
        setCurrent(4);
        console.log(response.data);
        setMeasuredImage(response.data.image_path);
        setAngle(response.data.angle);
        setMessage(response.data.message);
      }
    });
  };

  const recapture = () => {
    setImgSrc("");
    setMeasuredImage("");
    setCurrent(0);
  };

  //! 결과 출력 오른쪽에 출력  Steps 타이포그래피 찾아보기

  return (
    <BaseContainer>
      <div style={{ margin: "2rem" }}>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>
      </div>
      {loading ? (
        <StyledSpin tip="Loading..." size="large" />
      ) : (
        <>
          <Wrapper>
            {measuredImage === "" && (
              <div style={{ display: "flex", margin: "2rem" }}>
                {imgSrc ? (
                  <Wrapper>
                    <h1>
                      <b>Step 2. 자세 측정</b>
                    </h1>
                    <Img src={imgSrc} alt="img" />
                    <StyledButton type="primary" onClick={analyzeImage}>
                      자세 측정하기
                    </StyledButton>
                  </Wrapper>
                ) : (
                  <Wrapper>
                    <h1>
                      <b>Step 1. 이미지 캡처</b>
                    </h1>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                    <StyledButton type="danger" onClick={capture}>
                      화면 캡처하기
                    </StyledButton>
                  </Wrapper>
                )}
              </div>
            )}
          </Wrapper>

          {measuredImage && (
            <div style={{ display: "flex", margin: "2rem" }}>
              <Wrapper>
                <h1>
                  <b>Step 3. 결과확인</b>
                </h1>
                <Img
                  src={`data:image/jpeg;base64,${measuredImage}`}
                  alt="img"
                />
                <h1 style={{ color: "red" }}>
                  <b>
                    허리와 무릎의 각도 : {angle} &nbsp; {message}
                  </b>
                </h1>
                <StyledButton type="danger" onClick={recapture}>
                  다시 측정하기
                </StyledButton>
              </Wrapper>
            </div>
          )}
        </>
      )}
    </BaseContainer>
  );
}

export default Posture;
