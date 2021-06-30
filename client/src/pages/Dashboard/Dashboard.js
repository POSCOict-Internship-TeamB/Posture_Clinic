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
  Tooltip,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title, Text } = Typography;

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
const P = styled.p`
  font-size: 0.7rem;
  color: #fff;
`;

function Dashboard() {
  const [resultList, setResultList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState([]);

  const name = localStorage.getItem("user");

  useEffect(() => {
    axios.get("http://localhost:5000/api/result").then((response) => {
      if (response.data) {
        setResultList(response.data);
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
                title={<b style={{ fontSize: "0.7rem" }}>{name}님</b>}
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
          <b>
            <Text mark>{name}</Text>님의 지난 측정 결과
          </b>
        </Title>
        <StatisticContainer>
          <StyledCard>
            <Tooltip
              placement="bottomLeft"
              title={
                <>
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
                </>
              }
            >
              <Statistic
                title={<b>목 평균</b>}
                value={calAngleAvg("n")}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={process.env.PUBLIC_URL + "/neck.png"}
                    alt="icon"
                  />
                }
                suffix="°"
              />
            </Tooltip>
          </StyledCard>
          <StyledCard>
            <Tooltip
              placement="bottomLeft"
              title={
                <>
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
                </>
              }
            >
              <Statistic
                title={<b>허리 평균</b>}
                value={calAngleAvg("wk")}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                    }}
                    src={process.env.PUBLIC_URL + "/sit.png"}
                    alt="icon"
                  />
                }
                suffix="°"
              />
            </Tooltip>
          </StyledCard>
        </StatisticContainer>
      </MainContainer>
      <Row gutter={[8, 8]}>{renderCards}</Row>
      <ResultModal
        visible={visible}
        handleCancel={handleCancel}
        data={result}
      />
    </BaseContainer>
  );
}

export default Dashboard;
