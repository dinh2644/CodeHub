import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/DetailedPage.css";
import { supabase } from "../client";
import CommentsSection from "../components/CommentsSection";
import { Link } from "react-router-dom";

const DetailedPage = ({ data }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [count, setCount] = useState(0);
  const [comment, setComment] = useState({ content: "", post_id: 0 });

  // retrieve current single post and its amount of votes
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
      } else {
        setPost(data);
        setCount(data.votes);
      }
    };

    fetchPosts();
  }, [id]);

  // update post's vote count
  const updateVote = async (voteType) => {
    const newCount = voteType === "up" ? count + 1 : count - 1;
    const { error } = await supabase
      .from("Posts")
      .update({ votes: newCount })
      .eq("id", post.id);

    setCount(newCount);

    if (error) {
      console.log(error);
    }
  };

  // post comment
  const handleChange = (event) => {
    const { name, value } = event.target;
    setComment((prev) => {
      return {
        ...prev,
        [name]: value,
        post_id: post.id, //make connection here with the comments and the post it was created under
      };
    });
  };
  const handleSubmit = async () => {
    const { error } = await supabase.from("Comments").insert([comment]);
    if (error) {
      console.error(error);
    }
  };
  const originalDate = post ? String(post.created_at) : "";
  const date = new Date(originalDate);
  const formattedDate = date.toLocaleString();

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
      <div className="container detailedPageContainer">
        <div className="row">
          <div className="col mt-2">
            <h2>{post?.title}</h2>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col d-flex justify-content-between align-items-center">
            <span className="text-muted" style={{ fontSize: "14px" }}>
              Asked on {formattedDate}
            </span>
            <span style={{ fontSize: "14px" }}>
              <Link className="btn btn-primary" to={`/update/${post?.id}`}>
                Edit Post
              </Link>
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete Post
              </button>
            </span>
          </div>
          <hr />
        </div>
        <div className="row">
          <div className="col-1 d-flex flex-column align-items-center voteCell">
            <span
              className="arrows"
              onClick={() => updateVote("up")}
              style={{ cursor: "pointer" }}
            >
              ⬆️
            </span>
            <span>{count ? count : 0}</span>
            <span
              className="arrows"
              onClick={() => updateVote("down")}
              style={{ cursor: "pointer" }}
            >
              ⬇️
            </span>
          </div>
          <div className="col-11 ">
            <h5 style={{ fontWeight: "500" }}>{post?.details}</h5>
            <pre>
              <code>{post?.code}</code>
            </pre>
          </div>
        </div>

        <div className="row">
          <div className="col mt-4">
            <h5 className="me-2 " style={{ fontWeight: "400" }}>
              0 Answers
            </h5>
            <h3>Comments</h3>
          </div>
        </div>
        <CommentsSection postID={id} />
        <div className="row">
          <div className="col">
            <form id="myform">
              <div className="mb-3">
                <h3 htmlFor="title" className="form-label">
                  Your Answer
                </h3>

                <textarea
                  className="form-control"
                  name="content"
                  id="content"
                  cols="30"
                  rows="10"
                  value={comment.content}
                  onChange={handleChange}
                ></textarea>
                <div className="form-text">Be nice!</div>
              </div>

              <button
                type="submit"
                className="btn postAnswerBtn"
                onClick={handleSubmit}
              >
                Post Your Answer
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedPage;
