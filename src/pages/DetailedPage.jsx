import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/DetailedPage.css";
import { supabase } from "../client";
import CommentsSection from "../components/CommentsSection";
import Loading from "../components/Loading";
import { toast } from "react-hot-toast";

const DetailedPage = ({ data }) => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [isLoading, setIsLoading] = useState(false);

  // fetch posts from id
  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        console.error(error);
        navigate("/404");
      } else {
        setPost(data);
        setCount(data.votes);
      }
    };
    setTimeout(() => {
      setIsLoading(false);
      fetchPosts();
    }, 200);
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

    if (comment.content.trim() === "" || comment.content.trim().length <= 3) {
      toast.error("Comments must be longer than 3 characters!");
      return;
    }
    if (
      comment.secret_key.trim() === "" ||
      comment.secret_key.trim().length <= 2
    ) {
      toast.error("Secret Key cannot be empty and be minimum 3 characters!");
      return;
    }

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
    localStorage.setItem("toast", "Post Deleted!");
    window.location = "/";
  };

  // handle secret key
  const handleSecretKey = () => {
    const isValid = validKey === post.secret_key.trim();
    if (isValid) {
      if (actionKey == "submit") {
        localStorage.setItem("toast", "Access Granted!");
        window.location = `/update/${post?.id}`;
      }
      if (actionKey == "delete") {
        handleDelete();
      }
    } else {
      toast.error("Wrong Key!");
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="container detailedPageContainer">
          {/* Title of post */}
          <div className="row">
            <div className="col mt-3 askedRow detailedPageText">
              <h2>{post?.title}</h2>
            </div>
          </div>
          {/* Asked on & Edit and Delete buttons */}
          <div className="row mb-2">
            <div className="col d-flex justify-content-between align-items-center askedRow mb-2">
              <span
                className="text-muted detailedPageText"
                style={{ fontSize: "14px" }}
              >
                Asked on {formattedDate}
              </span>
              <span style={{ fontSize: "14px" }}>
                <button
                  className="button-4 mx-2 detailedPageText"
                  data-bs-toggle="modal"
                  data-bs-target="#modal"
                  onClick={() => setActionKey("submit")}
                >
                  Edit Post
                </button>
                <button
                  className="button-4"
                  style={{ background: "var(--four)", color: "var(--text)" }}
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
            <hr style={{ color: "var(--hr)" }} />
          </div>
          {/* Voting */}
          <div className="row">
            <div className="col-1 d-flex flex-column align-items-center voteCell">
              <span
                className="arrows"
                onClick={() => updateVote("up")}
                style={{ cursor: "pointer", color: "#5d6165" }}
              >
                ⬆️
              </span>
              <span className="detailedPageText">{count ? count : 0}</span>
              <span
                className="arrows"
                onClick={() => updateVote("down")}
                style={{ cursor: "pointer", color: "#5d6165" }}
              >
                ⬇️
              </span>
            </div>
            <div className="col ">
              <div
                style={{ fontWeight: "500", fontSize: "1.1rem" }}
                className="detailedPageText mb-2"
              >
                {post?.details}
              </div>
              <pre>
                <code className="code">
                  {post?.code ? post.code : "No code provided"}
                </code>
              </pre>
            </div>
          </div>

          {/* Image */}
          {post?.image && (
            <>
              <hr style={{ color: "var(--hr)" }} />
              <div className="row">
                <div className="col d-flex justify-content-center">
                  <img src={post?.image} alt="user's custom image" />
                </div>
              </div>
            </>
          )}

          {/* Comment section */}
          <div className="row">
            <div className="col">
              <h3 className="detailedPageText">{commentsCount} Comments</h3>
            </div>
          </div>
          <CommentsSection postID={id} />
          <div className="row">
            <div className="col">
              <form id="myform">
                <div className="mb-3">
                  <h3 htmlFor="title" className="form-label detailedPageText">
                    Your Answer
                  </h3>

                  <textarea
                    className="form-control mb-2 yourAnswerBox"
                    name="content"
                    id="content"
                    cols="30"
                    rows="10"
                    value={comment.content}
                    onChange={handleChange}
                    placeholder="Be nice!"
                  ></textarea>
                  {/* Set secret key */}
                  <input
                    style={{
                      fontSize: "15px",
                      width: "10rem",
                      background: "var(--code-box-details)",
                      color: "var(--text)",
                      padding: "8px",
                    }}
                    type="text"
                    placeholder="Set a Secret Key"
                    id="secret_key"
                    name="secret_key"
                    className="keyBar"
                    onChange={handleChange}
                    value={comment.secret_key}
                  />
                </div>

                <button
                  type="submit"
                  className="button-4 mb-5"
                  onClick={handleSubmit}
                  style={{
                    width: "10rem",
                    height: "3rem",
                    color: "var(--text)",
                  }}
                >
                  Post Your Answer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailedPage;
