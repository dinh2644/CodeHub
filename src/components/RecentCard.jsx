import React, { useState, useEffect } from "react";
import "../assets/RecentCard.css";
import { Link } from "react-router-dom";
import { supabase } from "../client";

const RecentCard = ({ data }) => {
  const [mostLiked, setMostLiked] = useState([]);
  const [mostLikedComments, setMostLikedComments] = useState(0);
  const [hasCode, setHasCode] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [hasNoImageOrCode, setHasNoImageOrCode] = useState(false);

  // get current most liked post
  useEffect(() => {
    const getMostLikedPost = () => {
      let maxVotes = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].votes > maxVotes) {
          maxVotes = data[i].votes;
          setMostLiked(data[i]);
        }
      }
    };
    getMostLikedPost();
  }, []);

  // fetch replies for this post
  useEffect(() => {
    const fetchRepliesCount = async () => {
      if (mostLiked && mostLiked.id) {
        const { data, error } = await supabase
          .from("Comments")
          .select("*")
          .eq("post_id", mostLiked.id);

        if (error) {
          console.error(error);
        } else {
          setMostLikedComments(data.length);
          checkForImageOrCode();
        }
      }
    };
    fetchRepliesCount();
  }, [data]);

  // get post's age
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
  const originalDate = mostLiked ? String(mostLiked.created_at) : "";
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
      <div className="card" style={{ width: "29rem" }}>
        <div className="card-body ">
          <h5 className="card-title darkMode" style={{ textAlign: "center" }}>
            🔥 Hottest Post
          </h5>
          {mostLiked.length !== 0 ? (
            <Link
              to={`${mostLiked.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="container">
                <hr style={{ color: "var(--hr)" }} />
                <div className="row">
                  <div className="col-8">
                    <div
                      className="card-text mb-1 darkMode"
                      style={{ fontSize: "19px" }}
                    >
                      {mostLiked.title}
                    </div>
                    <div
                      className="mb-1 postedOnText"
                      style={{ fontSize: "13px" }}
                    >
                      Posted {formattedDate}
                    </div>
                    <div
                      className="col d-flex mt-1"
                      style={{ fontSize: "14px" }}
                    >
                      {/* Tags */}
                      <div className=" d-flex">
                        <div
                          className="hasCodeBox1"
                          style={{ display: hasCode ? "" : "none" }}
                        >
                          Has Code
                        </div>
                        <div
                          className="hasImageBox1"
                          style={{
                            display: hasImage ? "" : "none",
                            marginLeft: "7px",
                          }}
                        >
                          Has Image
                        </div>
                        <div
                          className="generalDicussionBox1 "
                          style={{
                            display: hasNoImageOrCode ? "" : "none",
                            marginLeft: "7px",
                          }}
                        >
                          General Disucssion
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-4 d-flex flex-column justify-content-center align-items-end darkMode">
                    {" "}
                    <div>{mostLiked.votes} Votes</div>
                    <div>{mostLikedComments} Replies</div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="text-center">...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default RecentCard;
