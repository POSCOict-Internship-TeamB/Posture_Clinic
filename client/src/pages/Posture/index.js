import React from "react";
import { Link } from "react-router-dom";
import BaseContainer from "components/BaseComponents";
import styled from "@emotion/styled";
import { Typography, Button, Tooltip } from "antd";
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
  margin: 2rem;
  &:hover {
    color: black;
    border-color: black;
  }
  &:focus {
    color: black;
    border-color: black;
  }
`;

const P = styled.p`
  font-size: 0.7rem;
  color: #fff;
`;

function index(props) {
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
          <Link to="/posture/video">
            <Tooltip
              placement="bottomLeft"
              title={
                <>
                  <P>
                    <Text type="success">영상으로 앉은 자세를 측정합니다.</Text>
                  </P>
                  <P>
                    목과 허리의 자세를 측정해 실시간으로 바른자세를 유도합니다.
                  </P>
                </>
              }
            >
              <IconButton
                icon={<VideoCameraFilled style={{ fontSize: "35px" }} />}
              >
                <Text>
                  <b>영상으로 측정하기</b>
                </Text>
              </IconButton>
            </Tooltip>
          </Link>
          <Link to="/posture/image">
            <Tooltip
              placement="bottomLeft"
              title={
                <>
                  <P>
                    <Text type="success">이미지로 앉은 자세를 측정합니다.</Text>
                  </P>
                  <P>
                    목과 허리의 자세를 캡쳐된 이미지로 측정하고 결과를
                    반환합니다.
                  </P>
                  <P>
                    성별,나이대별 평균 수치를 대시보드 페이지에서 확인할 수
                    있습니다.
                  </P>
                </>
              }
            >
              <IconButton icon={<CameraFilled style={{ fontSize: "35px" }} />}>
                <Text>
                  <b>이미지로 측정하기</b>
                </Text>
              </IconButton>
            </Tooltip>
          </Link>
        </div>
      </Container>
    </BaseContainer>
  );
}

export default index;
