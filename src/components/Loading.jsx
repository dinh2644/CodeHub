import React from "react";
import "../assets/loading.css";

const Loading = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <div className="loader mb-2"></div>
        <h3>Just few seconds</h3>
        <p>We are fetching the thread for you</p>
      </div>
    </div>
  );
};

export default Loading;
