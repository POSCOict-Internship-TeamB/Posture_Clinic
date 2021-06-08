import React, { useState, useRef, useCallback } from "react";
import BaseContainer from "components/BaseComponents";
import Webcam from "react-webcam";

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
    const data = new FormData();
    const image = dataURItoBlob(capturedImg);

    data.append("image", image, "posture.png");
    console.log(data.get("image"));

    setImgSrc(capturedImg);
  }, [webcamRef, setImgSrc]);

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
