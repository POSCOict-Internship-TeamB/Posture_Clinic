import axios from "axios";
import BaseContainer from "components/BaseComponents";
import ResultModal from "./ResultModal";
import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Card,
  Col,
  Row,
  Avatar,
  Tag,
  Typography,
  Statistic,
  Descriptions,
  Badge,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

const MainContainer = styled.div`
  margin: 40px;
`;

const TagContainer = styled.div`
  margin-top: 10px;
`;

const Img = styled.img`
  width: 20px;
  height: 20px;
  padding: 2px;
`;

const StatisticContainer = styled.div`
  display: flex;
  width: 60%
  margin: 0 auto;

`;

const StyledCard = styled(Card)`
  width: 50%;
  display: flex;
  justify-content: center;
`;

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

  const tagStatus = (angle, part) => {
    if (part === "wk") {
      if (angle >= 95 && angle <= 125) {
        return { color: "#87d068", status: "정상" };
      }
      if (angle > 125) {
        return { color: "#d46b08", status: "주의" };
      } else {
        return { color: "#a8071a", status: "위험" };
      }
    } else {
      if (angle >= 80 && angle <= 100) {
        return { color: "#87d068", status: "정상" };
      }
      if (angle > 100) {
        return { color: "#d46b08", status: "주의" };
      } else {
        return { color: "#a8071a", status: "위험" };
      }
    }
  };

  const calAngleAvg = (part) => {
    let nAngle = 0;
    let wkAngle = 0;

    if (resultList !== undefined) {
      for (let i = 0; i < resultList.length; i++) {
        if (part === "wk") {
          wkAngle += parseInt(resultList[i].wk_angle);
        } else {
          nAngle += parseInt(resultList[i].n_angle);
        }
      }
    }
    console.log(wkAngle);

    if (part === "wk") {
      return wkAngle / resultList.length;
    } else {
      return nAngle / resultList.length;
    }
  };

  const showModal = (props) => {
    setVisible(true);
    setResult(props);
  };

  const handleCancel = (props) => {
    setVisible(props);
  };

  const renderCards = resultList.map((list, index) => {
    const date = list.time.slice(0, 10);
    // const time = list.time.slice(11, 16);

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
          <>
            <Title level={4}>{date} 측정 결과</Title>
            <TagContainer>
              <Tag
                icon={
                  <Img src={process.env.PUBLIC_URL + "/neck.png"} alt="icon" />
                }
                color={tagStatus(list.n_angle, "n").color}
              >
                {tagStatus(list.n_angle, "n").status}
              </Tag>
              <Tag
                icon={
                  <Img src={process.env.PUBLIC_URL + "/sit.png"} alt="icon" />
                }
                color={tagStatus(list.wk_angle, "wk").color}
              >
                {tagStatus(list.wk_angle, "wk").status}
              </Tag>
            </TagContainer>
          </>
        </Card>
      </Col>
    );
  });

  return (
    <BaseContainer>
      <MainContainer>
        <Title level={2}>
          <b>name님의 지난 측정 결과</b>
        </Title>

        {/* <Descriptions title="사용자 정보" bordered>
            <Descriptions.Item label="이름">박현우</Descriptions.Item>
            <Descriptions.Item label="나이">25</Descriptions.Item>
            <Descriptions.Item label="성별">남성</Descriptions.Item>
          </Descriptions> */}

        <StatisticContainer>
          <StyledCard>
            <Statistic
              title={<b>목 평균</b>}
              value={calAngleAvg("n")}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={
                <img
                  style={{ width: "40px", height: "40px" }}
                  src={process.env.PUBLIC_URL + "/neck.png"}
                  alt="icon"
                />
              }
              suffix="°"
            />
          </StyledCard>
          <StyledCard>
            <Statistic
              title={<b>허리 평균</b>}
              value={calAngleAvg("wk")}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={
                <img
                  style={{ width: "40px", height: "40px" }}
                  src={process.env.PUBLIC_URL + "/sit.png"}
                  alt="icon"
                />
              }
              suffix="°"
            />
          </StyledCard>
        </StatisticContainer>
      </MainContainer>
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
