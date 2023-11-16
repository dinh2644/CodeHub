import React, { useState, useEffect } from "react";
import "../assets/HomePage.css";
import Card from "../components/Card";
import RecentCard from "../components/RecentCard";

const HomePage = ({ data, searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [sortByVoteOrder, setSortByVotesOrder] = useState("asc");
  const [sortByDateOrder, setSortByDateOrder] = useState("asc");
  const [popularBtnClicked, setPopularBtnClicked] = useState(false);
  const [newestBtnClicked, setNewestBtnClicked] = useState(false);
  const [selectedTags, setSelectedTags] = useState("");

  // load data depending on whats in search bar
  useEffect(() => {
    const filteredData = data.filter((post) =>
      String(post.title).toLowerCase().includes(searchQuery.toLowerCase())
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

  // filter post by tags
  const filteredByTags = posts.filter((data) => {
    if (selectedTags) {
      const containsImage = data.image !== null && data.image !== "";
      const containsCode = data.code !== null && data.code !== "";
      const containsNothing = !containsImage && !containsCode;

      if (selectedTags === "code") {
        return containsCode;
      } else if (selectedTags === "image") {
        return containsImage;
      } else if (selectedTags === "general") {
        return containsNothing;
      }
    }
  });

  const displayedPosts = filteredByTags.length > 0 ? filteredByTags : posts;

  return (
    <>
      <div className="container">
        <div className="row">
          <div
            className="col-9 mt-4 mb-4 d-flex justify-content-between"
            style={{ fontSize: "18px" }}
          >
            <div>
              Order by{" "}
              <button
                className="mx-2 button-8 shadow-none"
                onClick={handleSortByDate}
                style={{ filter: newestBtnClicked ? "brightness(85%)" : "" }}
              >
                Newest
              </button>
              <button
                onClick={handleSortByVotes}
                style={{ filter: popularBtnClicked ? "brightness(85%)" : "" }}
                className="button-8 shadow-none"
              >
                Most Popular
              </button>
            </div>
            <select
              className="form-select shadow-none"
              aria-label="Default select example"
              onChange={(e) => setSelectedTags(e.target.value)}
            >
              <option value="">All Posts</option>
              <option value="code">With Code</option>
              <option value="image">With Image</option>
              <option value="general">General Discussion</option>
            </select>
          </div>
          <div className="col-3"></div>
        </div>
        <div className="row">
          {Array.isArray(displayedPosts) && displayedPosts.length !== 0 ? (
            displayedPosts.map((post, index) => (
              <div className="col-12" key={index}>
                <Card data={post} />
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
      </div>
    </>
  );
};

export default HomePage;
