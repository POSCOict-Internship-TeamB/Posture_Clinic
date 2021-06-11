import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button } from "antd";
import axios from "axios";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  border-radius: 20px;
`;

function Posture() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const [fileAngle, setFileAngle] = useState("");
  const [fileMessage, setFileMessage] = useState("");

  const [urlAngle, setUrlAngle] = useState("");
  const [urlMessage, setUrlMessage] = useState("");

  const videoConstraints = {
    width: "570",
    height: "320",
    facingMode: "user",
  };

  const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  const capture = useCallback(() => {
    const capturedImg = webcamRef.current.getScreenshot();
    const data = new FormData();
    const file = dataURItoBlob(capturedImg);
    data.append("file", file, "posture.png");
    console.log(data.get("file"));
    setImgSrc(capturedImg);

    axios
      .post("http://localhost:5000/api/posture-file", data)
      .then((response) => {
        setFileAngle(response.data.angle);
        setFileMessage(response.data.message);
      });
  }, [webcamRef, setImgSrc]);

  const onButtonClick = () => {
    axios.get("http://localhost:5000/api/posture-url").then((response) => {
      setUrlAngle(response.data.angle);
      setUrlMessage(response.data.message);
    });
  };

  return (
    <BaseContainer>
      <Wrapper>
        <div style={{ display: "flex", margin: "2rem" }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          <div style={{ marginLeft: "3rem" }}>
            {imgSrc && <img src={imgSrc} alt="img" />}
          </div>
        </div>
      </Wrapper>
      <Wrapper>
        <StyledButton type="primary" onClick={capture}>
          이미지 캡처하기
        </StyledButton>
      </Wrapper>
      {fileAngle && (
        <Wrapper>
          <h1 style={{ color: "red" }}>
            <b>
              허리와 무릎의 각도 : {fileAngle} &nbsp; {fileMessage}
            </b>
          </h1>
        </Wrapper>
      )}
      <Wrapper>
        <div style={{ display: "flex", margin: "2rem" }}>
          <img
            src="http://ncc.phinf.naver.net/20141017_225/1413512182571B2Vuy_JPEG"
            alt="image"
          />
          <div style={{ marginLeft: "3rem" }}>
            <img
              src={process.env.PUBLIC_URL + '/body.png'}
              alt="image"
              width='450px'
              height='600px'
            />
          </div>
        </div>
      </Wrapper>
      <Wrapper>
        <StyledButton type="primary" onClick={onButtonClick}>
          URL로 자세 측정
        </StyledButton>
      </Wrapper>
      {urlAngle && (
        <Wrapper>
          <h1 style={{ color: "red" }}>
            <b>
              허리와 무릎 간의 각도 : {urlAngle} &nbsp; {urlMessage}
            </b>
          </h1>
        </Wrapper>
      )}
    </BaseContainer>
  );
}

export default Posture;
