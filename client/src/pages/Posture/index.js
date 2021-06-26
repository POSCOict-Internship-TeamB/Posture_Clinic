import React from "react";
import BaseContainer from "components/BaseComponents";
import styled from "@emotion/styled";
import { Typography, Button } from "antd";
import { VideoCameraFilled, CameraFilled } from "@ant-design/icons";

const { Text, Title } = Typography;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconButton = styled(Button)`
  height: 65px;
  border-radius: 15px;
  &:hover {
    color: black;
    border-color: black;
  }
  &:focus {
    color: black;
    border-color: black;
  }
`;

function index() {
  return (
    <BaseContainer>
      <Container>
        <img
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
          src={process.env.PUBLIC_URL + "/mainlogo.png"}
          alt="icon"
        />
        <p style={{ fontSize: "3rem" }}>
          <b>Welcome to Posture-Clinic</b>
        </p>
        <img
          style={{ width: "100px", height: "100px" }}
          src={process.env.PUBLIC_URL + "/posture.png"}
          alt="icon"
        />
        <Title level={2}>
          <Text mark>측정 방법을 선택해주세요</Text>
        </Title>
        <div>
          <IconButton icon={<VideoCameraFilled style={{ fontSize: "35px" }} />}>
            <Text strong>영상으로 측정하기</Text>
          </IconButton>

          <IconButton icon={<CameraFilled style={{ fontSize: "35px" }} />}>
            <Text strong>이미지로 측정하기</Text>
          </IconButton>
        </div>
      </Container>
    </BaseContainer>
  );
}

export default index;
