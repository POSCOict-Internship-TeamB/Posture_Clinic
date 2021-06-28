import { Spin } from "antd";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";
// import Auth from "./hoc/auth";
import styled from "@emotion/styled";
import SiderLayout from "./components/Layout/SiderLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import MeasureImage from "pages/Posture/MeasureImage";
import Login from "./pages/Login/Login";
import index from "pages/Posture";
import MeasureVideo from "pages/Posture/MeasureVideo";

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
          
          <Route exact path="/posture" component={index} />
          <Route exact path="/posture/image" component={MeasureImage} />
          <Route exact path="/posture/video" component={MeasureVideo} />
          <Route exact path="/dashboard" component={Dashboard} />
        </Switch>
      </Container>
    </Suspense>
  );
}

export default App;
