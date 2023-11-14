// CommentsSection.jsx
import React, { useEffect, useState } from "react";
import "../assets/CommentsSection.css";
import { supabase } from "../client";

const CommentsSection = ({ postID }) => {
  const [comment, setComment] = useState([]);
  const [validKey, setValidKey] = useState("");

  // fetch comments
  useEffect(() => {
    const fetchCommentsForPost = async () => {
      const { data, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("post_id", postID);

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

  // handle hidden input
  const handleSecretKey = (secretKey, commentId) => {
    const isValid = validKey === secretKey;
    if (isValid) {
      handleDelete(commentId);
    }
  };

  return (
    <>
      {comment &&
        comment.map((answer, index) => (
          <div key={index}>
            <div className="row comment-section">
              <div className="col">
                <p className="content">{answer.content}</p>
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
        ))}
    </>
  );
};

export default CommentsSection;
