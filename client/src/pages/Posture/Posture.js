import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button, Spin } from "antd";
import axios from "axios";
import styled from "@emotion/styled";

const Img = styled.img`
  width: 622px;
  height: 350px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const StyledButton = styled(Button)`
  width: 150px;
  height: 50px;
  border-radius: 10px;
  margin: 1rem auto;
`;

const StyledSpin = styled(Spin)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function Posture() {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [angle, setAngle] = useState("");
  const [message, setMessage] = useState("");
  const [measuredImage, setMeasuredImage] = useState("");

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
    setLoading(true);
    const capturedImg = webcamRef.current.getScreenshot();
    console.log(capturedImg);
    const data = new FormData();
    const file = dataURItoBlob(capturedImg);
    data.append("file", file, "posture.png");
    setImgSrc(capturedImg);

    axios.post("http://localhost:5000/api/posture", data).then((response) => {
      setLoading(false);
      console.log(response.data);
      setMeasuredImage(response.data.image_path);
      setAngle(response.data.angle);
      setMessage(response.data.message);
    });
  }, [webcamRef, setImgSrc]);

  const recapture = () => {
    setImgSrc("");
    setMeasuredImage("");
  };

  return (
    <BaseContainer>
      {loading ? (
        <StyledSpin tip="Loading..." size="large" />
      ) : (
        <>
          <Wrapper>
            <div style={{ display: "flex", margin: "2rem" }}>
              {imgSrc ? (
                <Img src={imgSrc} alt="img" />
              ) : (
                <Wrapper>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                  />
                  <StyledButton type="primary" onClick={capture}>
                    자세 측정하기
                  </StyledButton>
                </Wrapper>
              )}
            </div>
          </Wrapper>
          <Wrapper>
            {measuredImage ? (
              <Wrapper>
                <Img
                  src={`data:image/jpeg;base64,${measuredImage}`}
                  alt="img"
                />
                <h1 style={{ color: "red" }}>
                  <b>
                    허리와 무릎의 각도 : {angle} &nbsp; {message}
                  </b>
                </h1>
                <StyledButton type="primary" onClick={recapture}>
                  다시 측정하기
                </StyledButton>
              </Wrapper>
            ) : imgSrc ? (
              <Img src={imgSrc} alt="img" />
            ) : (
              <Wrapper>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                />
                <StyledButton type="primary" onClick={capture}>
                  자세 측정하기
                </StyledButton>
              </Wrapper>
            )}
          </Wrapper>
        </>
      )}
    </BaseContainer>
  );
}

export default Posture;
