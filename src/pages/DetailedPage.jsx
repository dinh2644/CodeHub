import React from "react";
import { useParams } from "react-router-dom";
import "../assets/DetailedPage.css";

const DetailedPage = ({ data }) => {
  const { id } = useParams();
  const post = data.find((item) => String(item.id) === String(id));
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
            <span className="arrows">⬆️</span>
            <span>{post?.votes}</span>
            <span className="arrows">⬇️</span>
          </div>
          <div className="col-11 ">
            <h5 style={{ fontWeight: "500" }}>{post?.details}</h5>
            <code>{post?.code}</code>
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
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                />
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
