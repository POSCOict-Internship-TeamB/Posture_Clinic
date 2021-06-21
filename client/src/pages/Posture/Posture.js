import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button, Spin, Steps, Typography } from "antd";
import axios from "axios";
import styled from "@emotion/styled";
import {
  CameraOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  VideoCameraAddOutlined,
  MonitorOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Text, Title } = Typography;

const Img = styled.img`
  width: 700px;
  height: 500px;
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

const InfoContainer = styled.div`
  margin: 4rem;
  border-radius: 20px;
`;

const Info = styled.div`
  height: 100%;
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
  const [wkAngle, setWkAngle] = useState("");
  const [wkMessage, setWkMessage] = useState("");
  const [nAngle, setNAngle] = useState("");
  const [nMessage, setNMessage] = useState("");
  const [measuredImage, setMeasuredImage] = useState("");

  const videoConstraints = {
    width: "700",
    height: "500",
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
        setWkAngle(parseInt(response.data.wk_angle));
        setWkMessage(response.data.wk_message);
        setNAngle(parseInt(response.data.n_angle));
        setNMessage(response.data.n_message);
      }
    });
  };

  const recapture = () => {
    setImgSrc("");
    setMeasuredImage("");
    setCurrent(0);
  };

  const messageColor = (angle, part) => {
    if (part === "wk") {
      if (angle >= 85 && angle <= 95) {
        return "success";
      }
      if (angle > 95) {
        return "warning";
      } else {
        return "danger";
      }
    } else {
      if (angle >= 80 && angle <= 100) {
        return "success";
      }
      if (angle > 100) {
        return "warning";
      } else {
        return "danger";
      }
    }
  };

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
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2rem",
                }}
              >
                {imgSrc ? (
                  <Wrapper>
                    <Title>
                      <Text mark>
                        <b>Step 2. Analyze Image</b>
                      </Text>
                    </Title>
                    <Img src={imgSrc} alt="img" />
                    <StyledButton
                      type="primary"
                      icon={<MonitorOutlined />}
                      onClick={analyzeImage}
                    >
                      자세 측정하기
                    </StyledButton>
                  </Wrapper>
                ) : (
                  <Wrapper>
                    <Title>
                      <Text mark>
                        <b>Step 1. Image Capture</b>
                      </Text>
                    </Title>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    />
                    <StyledButton
                      type="danger"
                      icon={<CameraOutlined />}
                      onClick={capture}
                    >
                      화면 캡처하기
                    </StyledButton>
                  </Wrapper>
                )}
              </div>
            )}
          </Wrapper>

          {measuredImage && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "2rem",
              }}
            >
              <Wrapper>
                <Title>
                  <Text mark>
                    <b>Step 3. Result</b>
                  </Text>
                </Title>
                <Img
                  src={`data:image/jpeg;base64,${measuredImage}`}
                  alt="img"
                />
                <StyledButton
                  type="danger"
                  icon={<VideoCameraAddOutlined />}
                  onClick={recapture}
                >
                  다시 측정하기
                </StyledButton>
              </Wrapper>
              <InfoContainer>
                <Info>
                  <Title level={2}>
                    <Text>결과 확인</Text>
                  </Title>
                  <Title level={3}>
                    <Text type={messageColor(wkAngle, "wk")}>
                      <b>
                        허리와 무릎의 각도 : {wkAngle} <br /> {wkMessage}
                      </b>
                    </Text>
                    <br />
                    <Text type={messageColor(nAngle, "n")}>
                      <b>
                        목 각도 : {nAngle} <br /> {nMessage}
                      </b>
                    </Text>
                  </Title>
                </Info>
              </InfoContainer>
            </div>
          )}
        </>
      )}
    </BaseContainer>
  );
}

export default Posture;
