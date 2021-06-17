import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button } from "antd";
import axios from "axios";
import styled from "@emotion/styled";

const Img = styled.img`
  width: 622px;
  height: 350px;
`;

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
  const [landmarkImage, setLandmarkImage] = useState("");

  const [opencvImage, setOpencvImage] = useState("");

  const videoConstraints = {
    width: "622",
    height: "350",
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
    console.log(capturedImg);
    const data = new FormData();
    const file = dataURItoBlob(capturedImg);
    data.append("file", file, "posture.png");
    setImgSrc(capturedImg);

    axios
      .post("http://localhost:5000/api/posture-file", data)
      .then((response) => {
        setFileAngle(response.data.angle);
        setFileMessage(response.data.message);
        setLandmarkImage(response.data.image_path);
        console.log(response.data);
      });
  }, [webcamRef, setImgSrc]);

  const onButtonClick = () => {
    axios.post("http://localhost:5000/api/posture-opencv").then((response) => {
      console.log(response.data);
      setOpencvImage(response.data.image_path);
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
            {imgSrc && <Img src={imgSrc} alt="img" />}
          </div>
        </div>
      </Wrapper>
      <Wrapper>
        <StyledButton type="primary" onClick={capture}>
          이미지 캡처하기
        </StyledButton>
        <Button onClick={onButtonClick}>opencv!!</Button>
        {opencvImage && (
          <Img src={`data:image/jpeg;base64,${opencvImage}`} alt="img" />
        )}
      </Wrapper>
      {fileAngle && (
        <Wrapper>
          <div>
            {landmarkImage && (
              <Img src={`data:image/jpeg;base64,${landmarkImage}`} alt="img" />
            )}
          </div>
          <h1 style={{ color: "red" }}>
            <b>
              허리와 무릎의 각도 : {fileAngle} &nbsp; {fileMessage}
            </b>
          </h1>
        </Wrapper>
      )}
    </BaseContainer>
  );
}

export default Posture;
