// CommentsSection.jsx
import React, { useEffect, useState } from "react";
import "../assets/CommentsSection.css";
import { supabase } from "../client";
import { toast } from "react-hot-toast";

const CommentsSection = ({ postID }) => {
  const [comment, setComment] = useState([]);
  const [validKey, setValidKey] = useState("");

  // fetch comments
  useEffect(() => {
    const fetchCommentsForPost = async () => {
      const { data, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("post_id", postID)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setComment(data);
      }
    };
    fetchCommentsForPost();
  }, [postID]);

  // delete comments
  const handleDelete = async (commentId) => {
    const { error } = await supabase
      .from("Comments")
      .delete()
      .eq("id", commentId);
    if (error) {
      console.error(error);
    } else {
      window.location = `/${postID}`;
    }
  };

  // handle delete button
  const handleSecretKey = (secretKey, commentId) => {
    const isValid = validKey === secretKey.trim();
    if (isValid) {
      localStorage.setItem("toast", "Comment Deleted!");
      handleDelete(commentId);
    } else {
      toast.error("Wrong Key!");
    }
  };

  // get time the comment was posted
  // get post's age from creation
  const getTimeAgoString = (createdAt) => {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    const timeDifference = currentDate - createdAtDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 0) {
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <>
      {comment &&
        comment.map((answer, index) => {
          const originalDate = answer.created_at;
          const formattedDate = getTimeAgoString(originalDate);
          return (
            <div key={index}>
              <div className="row comment-section">
                <div className="col">
                  <div className="text-muted" style={{ fontSize: "15px" }}>
                    {formattedDate}
                  </div>
                  <pre>
                    <div className="content mt-3">{answer.content}</div>
                  </pre>

                  <button
                    className="btn btn-danger delete-button"
                    style={{
                      fontSize: "13px",
                      width: "3.7rem",
                      height: "2rem",
                    }}
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-${index}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="comment-divider"></div>
              {/* Delete Button Modal */}
              <div
                className="modal fade"
                id={`modal-${index}`}
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
                        onClick={() =>
                          handleSecretKey(answer.secret_key, answer.id)
                        }
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* End modal */}
            </div>
          );
        })}
    </>
  );
};

export default CommentsSection;
