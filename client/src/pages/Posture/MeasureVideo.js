import React, { useCallback, useRef, useState } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { VideoCameraFilled } from "@ant-design/icons";

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
  border: ${(props) => (props.recordState ? "5px solid red" : "none")};
`;

function MeasureWithVideo() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [recordState, setRecordState] = useState(false);

  const videoConstraints = {
    width: "700",
    height: "500",
    facingMode: "user",
  };

  const record = useCallback(() => {
    const capturedImg = webcamRef.current.getScreenshot();
    setImgSrc(capturedImg);
    setRecordState(true);
  }, []);

  return (
    <BaseContainer>
      <Container>
        <Wrapper>
          <Title>
            <Text mark>
              <b>Step 1. Image Capture</b>
            </Text>
          </Title>

          <StyledWebcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            recordState={recordState}
          />

          <StyledButton
            type="primary"
            icon={<VideoCameraFilled />}
            onClick={record}
          >
            녹화 시작
          </StyledButton>
          {imgSrc && <img src={imgSrc} alt="img" />}
        </Wrapper>
      </Container>
    </BaseContainer>
  );
}

export default MeasureWithVideo;
