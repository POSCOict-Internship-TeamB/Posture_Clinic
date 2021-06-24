import React from "react";
import { Button, Modal, Typography } from "antd";
import styled from "@emotion/styled";
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
            <p>
              <Text strong>허리각도 : {props.data.wk_angle}°</Text>
            </p>
            <p>
              <Text strong mark>{props.data.wk_message}</Text>
            </p>
            <p>
              <Text strong>목각도 : {props.data.n_angle}°</Text>
            </p>
            <p>
              <Text strong mark>{props.data.n_message}</Text>
            </p>
          </div>
        </Container>
      </Modal>
    </div>
  );
}

export default ResultModal;
