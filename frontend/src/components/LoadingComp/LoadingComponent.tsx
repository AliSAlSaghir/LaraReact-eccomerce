import React from "react";
import ReactLoading from "react-loading";

const LoadingComponent: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactLoading type="spin" color="purple" />
    </div>
  );
};

export default LoadingComponent;
