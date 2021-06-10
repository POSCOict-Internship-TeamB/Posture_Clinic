import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
import { Button } from "antd";
import axios from "axios";

function Posture() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const videoConstraints = {
    width: 500,
    height: 300,
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
    console.log(data.get('file'));
    setImgSrc(capturedImg);
    let variable = {
      body: data,
    };

    axios
      .post(
        "http://localhost:5000/api/postureImage",
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
        variable
      )
      .then((response) => {
        console.log(response);
      });
  }, [webcamRef, setImgSrc]);

  const onButtonClick = () => {
    axios.get("http://localhost:5000/api/posture").then((response) => {
      console.log(response.data);
    });
  };

  return (
    <BaseContainer>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      {imgSrc && <img src={imgSrc} alt="img" />}
      <Button type="primary" onClick={onButtonClick}>
        각도 불러오기
      </Button>
    </BaseContainer>
  );
}

export default Posture;
