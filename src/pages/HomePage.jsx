import React, { useState, useEffect } from "react";
import "../assets/HomePage.css";
import Card from "../components/Card";

const HomePage = ({ data, searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [sortByVoteOrder, setSortByVotesOrder] = useState("asc");
  const [sortByDateOrder, setSortByDateOrder] = useState("asc");
  const [popularBtnClicked, setPopularBtnClicked] = useState(false);
  const [newestBtnClicked, setNewestBtnClicked] = useState(false);

  // load data depending on whats in search bar
  useEffect(() => {
    const filteredData = data.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPosts(filteredData);
  }, [data, searchQuery]);

  // handle vote sorting
  const handleSortByVotes = () => {
    const newOrder = sortByVoteOrder === "asc" ? "desc" : "asc";
    const sortedDataByVotes = [...posts].sort((a, b) => {
      return newOrder === "asc"
        ? a.votes > b.votes
          ? 1
          : -1
        : b.votes > a.votes
        ? 1
        : -1;
    });
    setPosts(sortedDataByVotes);
    setSortByVotesOrder(newOrder);
    setPopularBtnClicked(!popularBtnClicked);
  };

  // handle newest sorting
  const handleSortByDate = () => {
    const newDate = sortByDateOrder === "asc" ? "desc" : "asc";
    const sortedDataByDate = [...posts].sort((a, b) => {
      return newDate === "asc"
        ? a.created_at > b.created_at
          ? 1
          : -1
        : b.created_at > a.created_at
        ? 1
        : -1;
    });
    setPosts(sortedDataByDate);
    setSortByDateOrder(newDate);
    setNewestBtnClicked(!newestBtnClicked);
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col mt-4 mb-4">
            Order by{" "}
            <button
              className="mx-2 sortButtons"
              onClick={handleSortByDate}
              style={{ filter: newestBtnClicked ? "brightness(85%)" : "" }}
            >
              Newest
            </button>
            <button
              onClick={handleSortByVotes}
              style={{ filter: popularBtnClicked ? "brightness(85%)" : "" }}
              className="sortButtons"
            >
              Most Popular
            </button>
          </div>
        </div>
        {posts.length !== 0 ? (
          posts.map((post, index) => (
            <div className="row" key={index}>
              <div className="col">
                <Card data={post} />
              </div>
            </div>
          ))
        ) : (
          // display if search bar cant find anything
          <div className="row">
            <div className="col">
              <p>No results found for your search.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
