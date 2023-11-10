import React, { useRef } from "react";
import { supabase } from "../client";

const UploadImage = ({ handleFile }) => {
  const hiddenFileInput = useRef(null);
  const handleImageUpload = (e) => {
    hiddenFileInput.current.click();
  };

  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileUploaded);

    if (error) {
      console.error(error);
    }
  };
  return (
    <div className="mb-3">
      <button className="button-upload" onClick={handleImageUpload}>
        Upload Image
      </button>
      <input
        type="file"
        className="form-control"
        id="exampleInputPassword1"
        style={{ display: "none" }}
        ref={hiddenFileInput}
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  );
};

export default UploadImage;
