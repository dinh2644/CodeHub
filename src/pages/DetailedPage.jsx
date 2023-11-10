import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../assets/DetailedPage.css";
import { supabase } from "../client";

const DetailedPage = ({ data }) => {
  const [postsVotes, setPostsVotes] = useState(0);
  const { id } = useParams();
  const post = data.find((item) => String(item.id) === String(id));
  const [count, setCount] = useState(postsVotes.votes);

  useEffect(() => {
    const fetchVotes = async () => {
      const { data, error } = await supabase.from("Posts").eq("id", data.id);

      if (error) {
        console.error(error);
      } else {
        setPostsVotes(data.votes);
      }
    };
    fetchVotes();
  }, []);

  // update vote count
  // const updateVote = async (event) => {
  //   event.preventDefault();

  //   const { error } = await supabase
  //     .from("Posts")
  //     .update({ votes: count + 1 })
  //     .eq("id", postsVotes.id);

  //   setCount((count) => count + 1);

  //   if (error) {
  //     console.log(error);
  //   }
  // };
  console.log(postsVotes);
  return (
    <>
      <div className="container detailedPageContainer">
        <div className="row">
          <div className="col">
            <h1>{post?.title}</h1>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col">
            <p className="text-muted">Posted on {post?.created_at}</p>
            <hr />
          </div>
        </div>

        <div className="row">
          <div className="col-1 d-flex flex-column align-items-center voteCell">
            <span
              className="arrows"
              onClick={updateVote}
              style={{ cursor: "pointer" }}
            >
              ⬆️
            </span>
            <span>{0}</span>
            <span
              className="arrows"
              onClick={updateVote}
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
        <hr />
        <div className="row">
          <div className="col">
            <form id="myform">
              <div className="mb-3">
                <h3 htmlFor="title" className="form-label">
                  Your Answer
                </h3>

                <textarea
                  className="form-control"
                  name="youranswer"
                  id="youranswer"
                  cols="30"
                  rows="10"
                ></textarea>
                <div className="form-text">Be nice!</div>
              </div>

              <button type="submit" className="btn postAnswerBtn">
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
