import React, { useCallback, useRef, useState } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import styled from "@emotion/styled";
import { Button, Typography, Badge, Steps, message } from "antd";
import {
  VideoCameraFilled,
  LoadingOutlined,
  VideoCameraAddOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { Step } = Steps;
const { Text, Title } = Typography;

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem;
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

const StyledWebcam = styled(Webcam)`
  border: ${(props) => (props.recordstate ? "5px solid red" : "none")};
`;

const WebCamContainer = styled.div`
  position: relative;
`;
const BadgeWrapper = styled.div`
  position: absolute;
  top: 25px;
  left: 25px;
`;

const BadgeMessage = styled.b`
  color: #fff;
  font-size: 1rem;
`;

const steps = [
  {
    title: <b>Check Camera</b>,
    icon: <VideoCameraAddOutlined />,
  },
  {
    title: <b>Analyze Video</b>,
    icon: <LoadingOutlined />,
  },
];
function MeasureWithVideo() {
  const webcamRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [recordState, setRecordState] = useState(false);

  const videoConstraints = {
    width: "800",
    height: "600",
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

  const record = useCallback(() => {
    setRecordState(true);
    setCurrent(1);

    setInterval(() => {
      const capturedImg = webcamRef.current.getScreenshot();
      const data = new FormData();
      const file = dataURItoBlob(capturedImg);
      data.append("file", file, "posture.png");

      axios.post("http://localhost:5000/api/posture", data).then((response) => {
        if (response.data) {
          console.log(response.data);
          message.success(response.data.wk_message);
          message.success(response.data.n_message);
        } else {
          message.error(
            "측정에 실패했습니다. 카메라에 전신이 나오도록 멀리 떨어져 주세요!"
          );
        }
      });
    }, 5000);
  }, []);

  const reRecord = () => {
    setRecordState(false);
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
      <Container>
        <Wrapper>
          <Title>
            <Text mark>
              <b>Analyze Video</b>
            </Text>
          </Title>
          <WebCamContainer>
            <StyledWebcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              recordstate={recordState}
            />
            {recordState && (
              <BadgeWrapper>
                <Badge
                  color="red"
                  status="processing"
                  text={<BadgeMessage>자세 측정 중</BadgeMessage>}
                />
              </BadgeWrapper>
            )}
          </WebCamContainer>
          {recordState ? (
            <StyledButton
              type="danger"
              icon={<VideoCameraFilled />}
              onClick={reRecord}
            >
              측정 중지
            </StyledButton>
          ) : (
            <StyledButton
              type="primary"
              icon={<VideoCameraFilled />}
              onClick={record}
            >
              측정 시작
            </StyledButton>
          )}
        </Wrapper>
      </Container>
    </BaseContainer>
  );
}

export default MeasureWithVideo;
