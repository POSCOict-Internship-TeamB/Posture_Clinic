import axios from "axios";
import BaseContainer from "components/BaseComponents";
import ResultModal from "./ResultModal";
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Avatar } from "antd";

import { UserOutlined } from "@ant-design/icons";

const { Meta } = Card;

function Dashboard() {
  const [resultList, setResultList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/result").then((response) => {
      if (response.data) {
        setResultList(response.data);
        console.log(response.data);
      }
    });
  }, []);

  const showModal = (props) => {
    setVisible(true);
    setResult(props);
  };

  const handleCancel = (props) => {
    setVisible(props);
  };

  const renderCards = resultList.map((list, index) => {
    const date = list.time.slice(0, 10);
    const time = list.time.slice(11, 16);
    console.log(date);
    console.log(time);

    return (
      <Col key={index} lg={6} md={12} xs={24}>
        <Card
          hoverable
          style={{
            width: "320px",
            margin: "16px auto",
          }}
          cover={
            <img
              style={{ width: "320px", height: "180px" }}
              alt="thumbnail"
              src={`data:image/jpeg;base64,${list.image_path}`}
            />
          }
          actions={[
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 0.5rem",
              }}
            >
              <Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={<b style={{ fontSize: "0.7rem" }}>name님</b>}
              />
            </div>,
          ]}
          onClick={() => showModal(list)}
        >
          {date} 측정 결과
        </Card>
      </Col>
    );
  });

  return (
    <BaseContainer>
      <Row gutter={[32, 32]}>{renderCards}</Row>
      <ResultModal
        visible={visible}
        handleCancel={handleCancel}
        data={result}
      />
    </BaseContainer>
  );
}

export default Dashboard;
