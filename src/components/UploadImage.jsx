import React, { useRef } from "react";
import "../assets/UploadImage.css";

const UploadImage = ({ handleFile }) => {
  const hiddenFileInput = useRef(null);

  const handleImageUpload = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div className="mb-1">
      <label
        htmlFor="file"
        style={{ marginRight: ".5rem", color: "var(--text)" }}
      >
        Have an image to upload?
      </label>
      <button
        type="button"
        className="button-upload button-4 createPageText"
        onClick={handleImageUpload}
      >
        Upload Image
      </button>
      <input
        type="file"
        className="form-control"
        id="file"
        style={{ display: "none" }}
        ref={hiddenFileInput}
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  );
};

export default UploadImage;
