import React, { useState } from "react";
import { Layout, Menu } from "antd";

import { NavLink, withRouter } from "react-router-dom";
import {
  SettingOutlined,
  UserOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";

const { Sider } = Layout;

const LogoContainer = styled.div`
  > span {
    margin-left: 10px;
    font-size: 1.5rem;
    color: white;
  }
  height: 64px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Img = styled.img`
  display: inline-block;
  height: 50px;
  vertical-align: middle;
  padding-left: 15px;
`;

const MenuContainer = styled.div`
  margin-top: 3rem;
`;

function SiderLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => onCollapse(collapsed)}
          width="250px"
        >
          <MenuContainer>
            <NavLink to="/">
              <LogoContainer>
                <Img
                  src="https://arcweb.co/wp-content/uploads/2016/10/react-logo-1000-transparent.png"
                  alt="Logo"
                />
                <span>{!collapsed ? <b>Posture-Clinic</b> : ""}</span>
              </LogoContainer>
            </NavLink>

            <Menu
              style={{ marginTop: "5rem" }}
              theme="dark"
              mode="inline"
              defaultSelectedKeys={["dashboard"]}
              //selectedKeys={[location.pathname]}
              // onClick={onMenuClicked}
            >
              <Menu.Item key="/dashboard">
                <NavLink to="/dashboard">
                  <PieChartOutlined />
                  <span>Dashboard</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/posture">
                <NavLink to="/posture">
                  <SettingOutlined />
                  <span>posture</span>
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/">
                <NavLink to="/">
                  <UserOutlined />
                  <span>login</span>
                </NavLink>
              </Menu.Item>
            </Menu>
          </MenuContainer>
        </Sider>
      </Layout>
    </div>
  );
}

export default withRouter(SiderLayout);
