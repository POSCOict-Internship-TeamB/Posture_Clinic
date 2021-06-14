import { Spin } from "antd";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
// import Auth from "./hoc/auth";
import styled from "@emotion/styled";
import SiderLayout from "./components/Layout/SiderLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import Posture from "./pages/Posture/Posture";
import Login from "./pages/Login/Login";

const Container = styled.div`
  display: flex;
`;

function App() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <Container>
        <SiderLayout /> 
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/posture" component={Posture} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Container>
    </Suspense>
  );
}

export default App;
