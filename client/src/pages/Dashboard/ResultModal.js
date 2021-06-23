import React from "react";
import { Button, Modal, Typography } from "antd";
import styled from "@emotion/styled";
const { Text, Title } = Typography;

const Img = styled.img`
  width: 500px;
  height: 300px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function ResultModal(props) {
  console.log(props);
  return (
    <div>
      <Modal
        visible={props.visible}
        width={550}
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
        <Wrapper>
          <Img
            src={`data:image/jpeg;base64,${props.data.image_path}`}
            alt="img"
          />
          허리각도 : {props.data.wk_angle}
          {props.data.wk_message}
          목각도 : {props.data.n_angle}
          {props.data.n_message}
        </Wrapper>
      </Modal>
    </div>
  );
}

export default ResultModal;
