import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    axios.get("http://localhost:5000/api").then((response) => {
      if (response.data) {
        setMessage(response.data.message);
      }
    });
  }, []);
  return (
    <div>
      {message}
      <div>g2gdddddddddddd2</div>
    </div>
  );
}

export default App;
