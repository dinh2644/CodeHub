import React from "react";
import "../assets/Card.css";
import { Link } from "react-router-dom";

const Card = ({ data }) => {
  return (
    <>
      <div className="card" style={{ width: "80rem" }}>
        <Link
          to={`${data.id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="card-body">
            <div className="mt-1 mb-3">Posted on {data.created_at}</div>
            <h4 className="card-title">{data.title}</h4>
            <p className="text-muted">{data.details}</p>
            <div className="mt-3 mb-1">
              <span>{data.votes} Votes</span> {""}
              <span>0 Answered</span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Card;
