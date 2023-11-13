import React, { useState } from "react";
import "../assets/CreatePage.css";
import { supabase } from "../client";
import UploadImage from "../components/UploadImage";
import { v4 as uuidv4 } from "uuid";

const CreatePage = () => {
  const [titleIsEmpty, setTitleIsEmpty] = useState(true);
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
    if (name === "title") {
      if (value !== "") {
        setTitleIsEmpty(false);
      } else {
        setTitleIsEmpty(true);
      }
    }
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
      <div className="container">
        <div className="row">
          <div className="col">
            <form id="myform">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
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
                <label htmlFor="details" className="form-label">
                  Details
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="details"
                  name="details"
                  onChange={handleChange}
                  value={post.details}
                  disabled={titleIsEmpty}
                />
                <div className="form-text">
                  Be specific and imagine you’re asking a question to another
                  person.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="details" className="form-label">
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
                ></textarea>
              </div>
              <UploadImage handleFile={handleImageChange} />

              <div className="mb-3">
                <label
                  htmlFor="secret_key"
                  className="form-label"
                  style={{ marginRight: "5px" }}
                >
                  Enter Secret Key:
                </label>
                <input
                  type="text"
                  id="secret_key"
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
                className="btn btn-primary"
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
