import React, { useState, useEffect } from "react";
import "../assets/UpdatePage.css";
import { useParams } from "react-router-dom";
import { supabase } from "../client";

const UpdatePage = ({ data }) => {
  const { id } = useParams();
  const post = data.find((item) => String(item.id) === String(id));
  const [titleIsEmpty, setTitleIsEmpty] = useState(true);

  // hold information for new updated inputs
  const [editedPost, setEditedPost] = useState({
    title: "",
    details: "",
    code: "",
  });

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedPost((prev) => {
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

  // handle edit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("Posts")
      .update([editedPost])
      .eq("id", id);
    if (error) {
      console.log(error);
    } else {
      setEditedPost({
        title: "",
        details: "",
        code: "",
      });

      window.location = "/";
    }
  };

  // handle delete post
  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      await supabase.from("Posts").delete().eq("id", id);
      await supabase.from("Comments").delete().eq("post_id", id);
    } catch (error) {
      console.error("Error deleting post and comments:", error);
    }

    window.location = "/";
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
                  value={editedPost.title}
                  placeholder={post.title}
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
                  value={editedPost.details}
                  disabled={titleIsEmpty}
                  placeholder={post.details}
                />
                <div className="form-text">
                  Be specific and imagine you’re asking a question to another
                  person.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="details" className="form-label">
                  Modify Code:
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  onChange={handleChange}
                  value={editedPost.code}
                  placeholder={post.code}
                  cols={30}
                  rows={10}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginRight: "10px" }}
                onClick={handleSubmit}
              >
                Update
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePage;
