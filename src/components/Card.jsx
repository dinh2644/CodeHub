import React, { useState, useEffect } from "react";
import "../assets/Card.css";
import { Link } from "react-router-dom";
import { supabase } from "../client.js";

const Card = ({ data }) => {
  const [repliesCount, setRepliesCount] = useState(0);
  const [hasCode, setHasCode] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  // fetch replies count manually
  useEffect(() => {
    const fetchRepliesCount = async () => {
      const { data: commentsData, error } = await supabase
        .from("Comments")
        .select("*")
        .eq("post_id", data.id);

      if (error) {
        console.error(error);
      } else {
        setRepliesCount(commentsData.length);
        checkForImageOrCode();
      }
    };
    fetchRepliesCount();
  }, [data]);

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
  const originalDate = data ? String(data.created_at) : "";
  const formattedDate = getTimeAgoString(originalDate);

  // check if card has image or code
  const checkForImageOrCode = () => {
    const containsImage = data.image !== null && data.image !== "";
    const containsCode = data.code !== null && data.code !== "";

    setHasImage(containsImage);
    setHasCode(containsCode);
  };

  return (
    <>
      <div className="card" style={{ width: "80rem" }}>
        <Link
          to={`${data.id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="mt-1 mb-3">Posted {formattedDate}</div>
              <div className="mt-1 mb-3 d-flex">
                <div
                  className="hasCodeBox"
                  style={{ display: hasCode ? "" : "none" }}
                >
                  Has Code
                </div>
                <div
                  className="hasImageBox"
                  style={{
                    display: hasImage ? "" : "none",
                    marginLeft: "5px",
                  }}
                >
                  Has Image
                </div>
              </div>
            </div>

            <h4 className="card-title">{data.title}</h4>

            <div className="mt-3 mb-1">
              <span>{data.votes} Votes</span> {""}
              <span>{repliesCount} Replies</span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
