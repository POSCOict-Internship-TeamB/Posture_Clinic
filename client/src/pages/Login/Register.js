import React, { useState } from "react";
import Axios from "axios";
import styled from "@emotion/styled";
import { Button, Radio } from "antd";

const ButtonWithMarginTop = styled(Button)`
  margin-top: 0rem;
`;

function Register() {
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
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value);
  };
  const onAgeHandler = (event) => {
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

    Axios.post("http://localhost:5000/api/register", body).then((response) => {
      if (response.data) {
        console.log(response.data);
      }
    });
  };
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
        <input type="email" value={Email} onChange={onEmailHandler} />

        <label>이름</label>
        <input type="text" value={Name} onChange={onNameHandler} />

        <label>비밀번호</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />

        <label>비밀번호 확인</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />

        <label>나이</label>
        <input type="text" value={Age} onChange={onAgeHandler} />
        <p></p>

        <label>성별</label>
        <Radio.Group onChange={onSexHandler} value={Gender}>
          <Radio value="female" name="gender">
            여성
          </Radio>
          <Radio value="male" name="gender">
            남성
          </Radio>
        </Radio.Group>

        <br />
        <ButtonWithMarginTop type="submit">회원 가입</ButtonWithMarginTop>
      </form>
    </div>
  );
}

export default Register;
