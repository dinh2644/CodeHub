import React, { useRef } from "react";
//import { supabase } from "../client";

const UploadImage = ({ handleFile }) => {
  const hiddenFileInput = useRef(null);

  const handleImageUpload = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div className="mb-3">
      <label htmlFor="file" style={{ marginRight: ".5rem" }}>
        Have an image to upload?
      </label>
      <button
        type="button"
        className="button-upload"
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
