import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button, Spin, Steps, Typography, Divider } from "antd";
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
  height: 100%;
`;

const Info = styled.div`
  display: flex;
  padding: 4rem;
  justify-content: center;
  flex-direction: column;
`;

const P = styled.p`
  font-size: 0.7rem;
  color: #595959;
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
  }, [current]);

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
      if (angle >= 95 && angle <= 125) {
        return "success";
      }
      if (angle > 125) {
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
                        <b>Step 2. Check / Analyze Image</b>
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
                  <Title>
                    <Text mark>
                      <b>결과를 확인하세요!</b>
                    </Text>
                  </Title>
                  <Title level={3}>
                    측정된 어깨와 목간의 각도는 <Text code>{nAngle}</Text>도
                    입니다. <br />
                    <Text type={messageColor(nAngle, "n")}>
                      <b>{nMessage}</b>
                    </Text>
                  </Title>
                  <Title level={3}>
                    측정된 척추와 무릎간의 각도는 <Text code>{wkAngle}</Text>
                    도 입니다 <br />
                    <Text type={messageColor(wkAngle, "wk")}>
                      <b>{wkMessage}</b>
                    </Text>
                  </Title>

                  <div style={{ marginTop: "6rem" }}>
                    <Divider orientation="left">
                      <b>목</b>
                    </Divider>
                    <P>
                      80도 이상 100도 이하 :
                      <Text type="success">올바른 자세</Text>
                    </P>
                    <P>
                      100도 초과 :
                      <Text type="warning">
                        주의단계 (장시간 유지 시 목,어깨에 무리)
                      </Text>
                    </P>
                    <P>
                      80도 미만 :
                      <Text type="danger">
                        경고단계 (장시간 유지 시 거북목의 원인)
                      </Text>
                    </P>
                    <Divider orientation="left">
                      <b>척추</b>
                    </Divider>
                    <P>
                      95도 이상 125도 이하 :
                      <Text type="success">올바른 자세</Text>
                    </P>
                    <P>
                      125도 초과 :
                      <Text type="warning">
                        주의단계 (장시간 유지 시 척추에 무리)
                      </Text>
                    </P>
                    <P>
                      95도 미만 :
                      <Text type="danger">
                        경고단계 (장시간 유지 시 허리디스크의 원인)
                      </Text>
                    </P>
                  </div>
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
