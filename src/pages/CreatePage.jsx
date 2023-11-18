import React, { useState } from "react";
import "../assets/CreatePage.css";
import { supabase } from "../client";
import UploadImage from "../components/UploadImage";
import { v4 as uuidv4 } from "uuid";

const CreatePage = () => {
  const [post, setPost] = useState({
    title: "",
    details: "",
    code: "",
    image: "",
    secret_key: "",
  });

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // handle image change
  const handleImageChange = async (image) => {
    // upload image first to storage
    const fileName = `images/${uuidv4()}.png`;
    await supabase.storage.from("uploads").upload(fileName, image, {
      cacheControl: "3600",
      upsert: false,
    });

    // get public url of that image
    const { data: imageURL } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    // extract url
    const imageUrl = imageURL?.publicUrl;

    // update state with the image URL
    setPost((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  };

  // create post
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("Posts").insert([post]);

    if (error) {
      console.error(error);
    } else {
      window.location = "/";
    }
  };

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col mt-3">
            <form id="myform">
              <div className="mb-3">
                <label htmlFor="title" className="form-label createPageText">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  onChange={handleChange}
                  value={post.title}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="details" className="form-label createPageText">
                  Details
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="details"
                  name="details"
                  onChange={handleChange}
                  value={post.details}
                />
                <div className="form-text createPageText">
                  Be specific and imagine you’re asking a question to another
                  person.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="details" className="form-label createPageText">
                  Paste Your Code:
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  onChange={handleChange}
                  value={post.code}
                  cols={30}
                  rows={10}
                  placeholder="optional"
                ></textarea>
              </div>
              <UploadImage handleFile={handleImageChange} />

              <div className="mb-3">
                <label
                  htmlFor="secret_key"
                  className="form-label createPageText"
                  style={{ marginRight: "5px" }}
                >
                  Enter Secret Key:
                </label>
                <input
                  type="text"
                  id="secret_key"
                  className="keyBar"
                  style={{
                    background: "white",
                    color: "black",
                    textDecoration: "none",
                  }}
                  name="secret_key"
                  onChange={handleChange}
                  value={post.secret_key}
                />
              </div>

              <button
                type="submit"
                className="button-5 createPageText"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePage;
