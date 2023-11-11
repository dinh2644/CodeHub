// CommentsSection.jsx
import React, { useEffect, useState } from "react";
import "../assets/CommentsSection.css";
import { supabase } from "../client";

const CommentsSection = ({ postID }) => {
  const [comment, setComment] = useState([]);
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
  }, []);
  return (
    <>
      {comment &&
        comment.map((answer, index) => (
          <div key={index}>
            <div className="row comment-section">
              <div className="col ">
                <p className="content">{answer.content}</p>
              </div>
            </div>
            <div className="comment-divider"></div>
          </div>
        ))}
    </>
  );
};

export default CommentsSection;
