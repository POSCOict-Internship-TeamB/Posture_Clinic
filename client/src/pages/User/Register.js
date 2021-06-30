import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { Radio, Button, message } from "antd";

const StyledButton = styled(Button)`
  margin: 1rem 0;
`;

const StyledInput = styled.input`
  margin-bottom: 0.5rem;
`;

function Register(props) {
  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Gender, setGender] = useState("");
  const [Age, setAge] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onNameHandler = (event) => {
    console.log(event.currentTarget.value);
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    console.log(event.currentTarget.value);
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    console.log(event.currentTarget.value);
    setConfirmPassword(event.currentTarget.value);
  };
  const onAgeHandler = (event) => {
    console.log(event.currentTarget.value);
    setAge(event.currentTarget.value);
  };

  const onSexHandler = (e) => {
    console.log("radio checked", e.target.value);
    setGender(e.target.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
    }
    let body = {
      email: Email,
      password: Password,
      name: Name,
      age: Age,
      gender: Gender,
    };
    console.log(body);
    axios.post("http://localhost:5000/api/register", body).then((response) => {
      if (response.data) {
        message.success("회원가입 성공");
        props.history.push("/posture");
      } else {
        message.error("회원가입 실패");
      }
    });
  };

  const CyanBox = styled.div`
    .logo-area {
      display: block;
      padding-bottom: 2rem;
      font-weight: bold;
    }
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.025);
    width: 360px;
    background: pink;
    border-radius: 2px;
    margin: auto;
  `;

  return (
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
        <label>이메일</label>
        <StyledInput type="email" value={Email} onChange={onEmailHandler} />

        <label>이름</label>
        <StyledInput type="text" value={Name} onChange={onNameHandler} />

        <label>비밀번호</label>
        <StyledInput
          type="password"
          value={Password}
          onChange={onPasswordHandler}
        />

        <label>비밀번호 확인</label>
        <StyledInput
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />

        <label>나이</label>
        <StyledInput type="text" value={Age} onChange={onAgeHandler} />

        <label>성별</label>
        <Radio.Group onChange={onSexHandler} value={Gender}>
          <Radio value="female" name="gender">
            여성
          </Radio>
          <Radio value="male" name="gender">
            남성
          </Radio>
        </Radio.Group>
        <StyledButton type="primary" onClick={onSubmitHandler}>
          회원 가입
        </StyledButton>
      </form>
    </div>
  );
}

export default Register;
