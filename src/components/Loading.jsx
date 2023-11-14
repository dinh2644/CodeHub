import React from "react";
import "../assets/loading.css";

const Loading = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <span className="loader"></span>
    </div>
  );
};

export default Loading;
