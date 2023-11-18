import React, { useState, useEffect } from "react";
import "../assets/UpdatePage.css";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../client";
import UploadImage from "../components/UploadImage";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";

const UpdatePage = ({ data }) => {
  const { id } = useParams();
  const post = data.find((item) => String(item.id) === String(id));

  // hold information for new updated inputs
  const [editedPost, setEditedPost] = useState({
    title: "",
    details: "",
    code: "",
    image: "",
    secret_key: "",
  });
  const [imageName, setImageName] = useState({ fileName: "" });

  // handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedPost((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // handle edit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editedPost.title.trim() === "") {
      toast.error("Title cannot be empty!");
      return;
    }
    if (editedPost.details.trim() === "") {
      toast.error("Details cannot be empty!");
      return;
    }
    if (
      editedPost.secret_key.trim() === "" ||
      editedPost.secret_key.trim().length <= 2
    ) {
      toast.error("Secret Key cannot be empty and be minimum 3 characters!");
      return;
    }

    const { error } = await supabase
      .from("Posts")
      .update([editedPost])
      .eq("id", id);
    if (error) {
      console.error(error);
    } else {
      setEditedPost({
        title: "",
        details: "",
        code: "",
      });
      localStorage.setItem("toast", "Post Updated!");
      window.location = "/";
    }
  };

  // handle delete post
  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      await supabase.from("Posts").delete().eq("id", id);
      await supabase.from("Comments").delete().eq("post_id", id);
    } catch (error) {
      console.error("Error deleting post and comments:", error);
    }
    localStorage.setItem("toast", "Post Deleted!");
    window.location = "/";
  };

  // handle image change
  const handleImageChange = async (image) => {
    // upload image first to storage
    const fileName = `images/${uuidv4()}.png`;
    const fileName1 = image.name;
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
    setEditedPost((prev) => ({
      ...prev,
      image: imageUrl,
    }));

    setImageName((prev) => ({
      ...prev,
      fileName: fileName1,
    }));
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <form id="myform">
              <div className="mb-3">
                <label
                  htmlFor="title"
                  className="form-labelupdatePageText updatePageText"
                >
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  onChange={handleChange}
                  value={editedPost.title}
                  placeholder={post?.title}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="details" className="form-label updatePageText">
                  Details
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="details"
                  name="details"
                  onChange={handleChange}
                  value={editedPost.details}
                  placeholder={post?.details}
                />
                <div className="form-text updatePageText">
                  Be specific and imagine you’re asking a question to another
                  person.
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="code" className="form-label updatePageText">
                  Modify Code:
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  id="code"
                  name="code"
                  onChange={handleChange}
                  value={editedPost.code}
                  placeholder={post?.code}
                  cols={30}
                  rows={10}
                ></textarea>
              </div>

              <UploadImage handleFile={handleImageChange} />
              <div className="selected-image-container">
                {imageName && (
                  <p style={{ color: "green", fontWeight: "700" }}>
                    {" "}
                    {imageName.fileName}
                  </p>
                )}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="secret_key"
                  className="form-label createPageText"
                  style={{ marginRight: "5px" }}
                >
                  Update Secret Key:
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
                  value={editedPost.secret_key}
                />
              </div>

              <button
                className="button-6 updatePageText"
                style={{ marginRight: "10px" }}
                onClick={handleSubmit}
              >
                Update
              </button>
              <button
                className="button-6 updatePageText"
                onClick={handleDelete}
                style={{ background: "var(--four)", color: "black" }}
              >
                Delete
              </button>
              <Link
                className="button-6 updatePageText"
                to={`/${id}`}
                style={{ textDecoration: "none", marginLeft: "9px" }}
              >
                Cancel
              </Link>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdatePage;
