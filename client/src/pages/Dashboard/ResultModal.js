import React from "react";
import { Button, Modal, Typography } from "antd";
import styled from "@emotion/styled";
import Title from "antd/lib/typography/Title";
const { Text } = Typography;

const Img = styled.img`
  width: 500px;
  height: 300px;
`;

const Container = styled.div`
  display: flex;
`;

function ResultModal(props) {
  return (
    <div>
      <Modal
        visible={props.visible}
        width={900}
        title={<b>측정 결과</b>}
        onCancel={() => props.handleCancel(false)}
        footer={[
          <Button
            key="back"
            type="primary"
            onClick={() => props.handleCancel(false)}
          >
            확인
          </Button>,
        ]}
      >
        <Container>
          <Img
            src={`data:image/jpeg;base64,${props.data.image_path}`}
            alt="img"
          />
          <div
            style={{
              marginLeft: "2rem",
            }}
          >
            <Title level={3}>측정 결과</Title>
            <p>
              <img
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
                src={process.env.PUBLIC_URL + "/sit.png"}
                alt="icon"
              />
              <Text strong>허리각도 : {props.data.wk_angle}°</Text>
            </p>
            <p>
              <Text strong mark>
                {props.data.wk_message}
              </Text>
            </p>
            <p>
              <img
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
                src={process.env.PUBLIC_URL + "/neck.png"}
                alt="icon"
              />
              <Text strong>목각도 : {props.data.n_angle}°</Text>
            </p>
            <p>
              <Text strong mark>
                {props.data.n_message}
              </Text>
            </p>
          </div>
        </Container>
      </Modal>
    </div>
  );
}

export default ResultModal;
