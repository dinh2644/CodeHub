import React, { useState } from "react";
import "../assets/CreatePage.css";
import { supabase } from "../client";
import UploadImage from "../components/UploadImage";
import { v4 as uuidv4 } from "uuid";

const CreatePage = () => {
  const [titleIsEmpty, setTitleIsEmpty] = useState(true);
  const [post, setPost] = useState({ title: "", details: "", code: "" });

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

  // create post
  const handleSubmit = async (image) => {
    try {
      const fileName = `images/avatar_${uuidv4()}.png`;
      await supabase.from("Posts").insert([post]);
      await supabase.storage.from("uploads").upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });
    } catch (error) {
      console.error(error);
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
              <UploadImage handleFile={handleSubmit} />

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
