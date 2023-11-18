import React, { useState, useEffect } from "react";
import "../assets/Card.css";
import { Link } from "react-router-dom";
import { supabase } from "../client.js";

const Card = ({ data }) => {
  const [repliesCount, setRepliesCount] = useState(0);
  const [hasCode, setHasCode] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [hasNoImageOrCode, setHasNoImageOrCode] = useState(false);

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
    const containsNothing = !containsImage && !containsCode;

    setHasImage(containsImage);
    setHasCode(containsCode);
    setHasNoImageOrCode(containsNothing);
  };

  return (
    <>
      <div className="card cardMain" style={{ width: "68rem" }}>
        <Link
          to={`${data.id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="card-body">
            <div className="row">
              <div className="col-6">
                {/* Posted date */}
                <div className="mt-2 postedText">Posted {formattedDate}</div>
                {/* Title */}
                <h4 className="card-title mt-2 cardText">{data.title}</h4>
                {/* Tags */}
                <div className="mt-3 mb-2 d-flex">
                  <div
                    className="hasCodeBox"
                    style={{
                      display: hasCode ? "" : "none",
                      marginRight: "8px",
                    }}
                  >
                    Has Code
                  </div>
                  <div
                    className="hasImageBox"
                    style={{
                      display: hasImage ? "" : "none",
                      marginRight: "10px",
                    }}
                  >
                    Has Image
                  </div>
                  <div
                    className="generalDicussionBox"
                    style={{
                      display: hasNoImageOrCode ? "" : "none",
                    }}
                  >
                    General Disucssion
                  </div>
                </div>
              </div>
              {/* Votes/Replies */}
              <div className="col-6 d-flex flex-column align-items-end justify-content-center cardText">
                <div>{data.votes} Votes</div> {""}
                <div>{repliesCount} Replies</div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
