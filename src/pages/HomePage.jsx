import React, { useState, useEffect } from "react";
import "../assets/HomePage.css";
import Card from "../components/Card";

const HomePage = ({ data }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col mt-4 mb-4">
            Order by <button>Newest</button>
            <button>Most Popular</button>
          </div>
        </div>
        {posts &&
          posts.map((post, index) => (
            <div className="row" key={index}>
              <div className="col">
                <Card data={post} />
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default HomePage;
