import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/DetailedPage.css";
import { supabase } from "../client";
import CommentsSection from "../components/CommentsSection";

const DetailedPage = ({ data, userId }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [count, setCount] = useState(0);
  const [comment, setComment] = useState({
    content: "",
    post_id: 0,
    secret_key: "",
  });
  const [validKey, setValidKey] = useState("");
  const [commentsCount, setCommentsCount] = useState(0);
  const [actionKey, setActionKey] = useState(null);
  const [hasDownVoted, setHasDownVoted] = useState(false);

  // retrieve current single post and its amount of votes
  useEffect(() => {
    //fetch post's data
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

  // retrieve comments count for a post
  useEffect(() => {
    const fetchCommentsForPost = async () => {
      const { data, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("post_id", id);

      if (error) {
        console.error(error);
      } else {
        setCommentsCount(data.length);
      }
    };
    fetchCommentsForPost();
  }, []);

  // update vote count
  const updateVote = async (voteType) => {
    //const newCount = voteType === "up" ? count + 1 : count - 1;
    let newCount = count;
    if (voteType === "up") {
      newCount = count + 1;
      setHasDownVoted(false);
    }
    if (voteType === "down" && hasDownVoted === false) {
      newCount = count - 1;
      setHasDownVoted(true);
    }
    const { error } = await supabase
      .from("Posts")
      .update({ votes: newCount })
      .eq("id", post.id);

    setCount(newCount);

    if (error) {
      console.error(error);
    }
  };

  // handle input change
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

  // post comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("Comments").insert([comment]);
    if (error) {
      console.error(error);
    } else {
      window.location = `/${id}`;
    }
  };

  // set relative date when post was created
  const originalDate = post ? String(post.created_at) : "";
  const date = new Date(originalDate);
  const formattedDate = date.toLocaleString();

  // handle delete post
  const handleDelete = async () => {
    try {
      await supabase.from("Posts").delete().eq("id", id);
      await supabase.from("Comments").delete().eq("post_id", id);
    } catch (error) {
      console.error("Error deleting post and comments:", error);
    }

    window.location = "/";
  };

  // handle secret key
  const handleSecretKey = () => {
    const isValid = validKey === post.secret_key;
    if (isValid) {
      if (actionKey == "submit") {
        window.location = `/update/${post?.id}`;
      }
      if (actionKey == "delete") {
        handleDelete();
      }
    }
  };

  return (
    <>
      <div className="container detailedPageContainer">
        {/* Title of post */}
        <div className="row">
          <div className="col mt-2">
            <h2>{post?.title}</h2>
          </div>
        </div>
        {/* Asked on & Edit and Delete buttons */}
        <div className="row mb-2">
          <div className="col d-flex justify-content-between align-items-center">
            <span className="text-muted" style={{ fontSize: "14px" }}>
              Asked on {formattedDate}
            </span>
            <span style={{ fontSize: "14px" }}>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#modal"
                onClick={() => setActionKey("submit")}
              >
                Edit Post
              </button>
              <button
                className="btn btn-danger"
                data-bs-toggle="modal"
                data-bs-target="#modal"
                onClick={() => setActionKey("delete")}
              >
                Delete Post
              </button>
              {/* Delete Button Modal */}
              <div
                className="modal fade"
                id="modal"
                tabIndex={-1}
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Enter Secret Key
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        onChange={(e) => setValidKey(e.target.value)}
                        style={{ background: "white", color: "black" }}
                      />
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSecretKey}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End modal */}
            </span>
          </div>
          <hr />
        </div>
        {/* Voting */}
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
        {/* Image */}
        <div className="row">
          <div className="col">
            <img src={post?.image} alt="" />
          </div>
        </div>
        {/* Comment section */}
        <div className="row">
          <div className="col mt-4">
            <h5 className="me-2 " style={{ fontWeight: "400" }}>
              {} Answers
            </h5>
            <h3>{commentsCount} Comments</h3>
          </div>
        </div>
        <CommentsSection postID={id} userId={userId} />
        <div className="row">
          <div className="col">
            <form id="myform">
              <div className="mb-3">
                <h3 htmlFor="title" className="form-label">
                  Your Answer
                </h3>

                <textarea
                  className="form-control mb-2"
                  name="content"
                  id="content"
                  cols="30"
                  rows="10"
                  value={comment.content}
                  onChange={handleChange}
                  placeholder="Be nice!"
                ></textarea>

                <input
                  style={{
                    fontSize: "15px",
                    width: "15rem",
                    background: "white",
                    color: "black",
                  }}
                  type="text"
                  placeholder="Set a secret key for your comment!"
                  id="secret_key"
                  name="secret_key"
                  onChange={handleChange}
                  value={comment.secret_key}
                />
              </div>

              <button
                type="submit"
                className="btn postAnswerBtn mb-5"
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
