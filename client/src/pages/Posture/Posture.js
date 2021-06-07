import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";
// react-webcam 설치해서 사진캡쳐 기능

function Posture() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const videoConstraints = {
    width: 500,
    height: 300,
    facingMode: "user",
  };

  console.log(imgSrc);

  const capture = useCallback(() => {
    const capturedImg = webcamRef.current.getScreenshot();
    setImgSrc(capturedImg);
  }, [webcamRef, setImgSrc]);

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
    </BaseContainer>
  );
}

export default Posture;
