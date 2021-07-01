import React, { useState } from "react";
import Axios from "axios";
import styled from "@emotion/styled";
import BaseContainer from "components/BaseComponents";
import spacing from "lib/styles/stylesheet/spacing";
import size from "../../lib/styles/stylesheet/size";
import { Link } from "react-router-dom";
import { Button, message } from "antd";

const Container = styled.div`
  ${size("100%")}
  margin: ${spacing[80]};
  background-color: #f0f0f0;
`;

const StyledButton = styled(Button)`
  margin: 1rem 0;
`;

const StyledInput = styled.input`
  margin-bottom: 0.5rem;
`;

function Login(props) {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  // const data = () => {
  //   Axios.get("http://localhost:5000/api/analyze").then((response) => {
  //     if (response.data) {
  //       console.log(response.data);
  //     } else {
  //       message.error("로그인 실패");
  //     }
  //   });
  // };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = {
      email: Email,
      password: Password,
    };
    Axios.post("http://localhost:5000/api/login", body).then((response) => {
      if (response.data) {
        message.success("로그인 성공!");
        props.history.push("/posture");
        console.log(response.data);
        window.localStorage.setItem("user", response.data[0].name);
        window.localStorage.setItem("age", response.data[0].age);
        window.localStorage.setItem("gender", response.data[0].gender);
        window.localStorage.setItem("access_token", response.data.access_token);
        window.localStorage.setItem(
          "refresh_token",
          response.data.refresh_token
        );
      } else {
        message.error("로그인 실패");
      }
    });
  };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmitHandler}
        >
          <label>Email</label>
          <StyledInput type="email" value={Email} onChange={onEmailHandler} />
          <label>Password</label>
          <StyledInput
            type="password"
            value={Password}
            onChange={onPasswordHandler}
          />

          <StyledButton onClick={onSubmitHandler}>로그인</StyledButton>
          <Link to="/register">계정이 없으신가요?</Link>
        </form>
      </div>
    </Container>
  );
}

export default Login;
