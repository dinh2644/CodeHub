import React, { useState } from "react";
import "../assets/CreatePage.css";
import { supabase } from "../client";
import UploadImage from "../components/UploadImage";

const CreatePage = () => {
  const [titleIsEmpty, setTitleIsEmpty] = useState(true);
  const [post, setPost] = useState({ title: "", details: "" });
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

  const handleSubmit = async () => {
    const { error } = await supabase.from("Posts").insert([post]);
    if (error) {
      console.error(error);
    }
  };
  console.log(post);
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
                <div className="form-text">
                  Be specific and imagine you’re asking a question to another
                  person.
                </div>
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
