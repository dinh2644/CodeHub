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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setPosts(data);
  }, [data]);

  // sort by votes
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

  // sort by newest
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

  // handle pagination
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // hold multipled filtered data
  const filteredData = posts
    // search filter
    .filter((post) => {
      return (
        String(searchQuery.toLowerCase()) === "" ||
        (post?.title &&
          post?.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    })
    // dropdown filter
    .filter((post) => {
      if (selectedTags) {
        const containsImage = post?.image !== null && post?.image !== "";
        const containsCode = post?.code !== null && post?.code !== "";
        const containsNothing = !containsImage && !containsCode;

        if (selectedTags === "code") {
          return containsCode;
        } else if (selectedTags === "image") {
          return containsImage;
        } else if (selectedTags === "general") {
          return containsNothing;
        }
      }
      return true;
    });

  const slicedData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <>
      <div className="container mt-3">
        <div className="row">
          {/* Left Section - Mapped Posts */}
          <div className="col-10 mt-4 mb-4">
            {/* Sort buttons and select tags */}
            <div
              className="d-flex justify-content-between mb-4 orderByAndBtns"
              style={{ fontSize: "18px" }}
            >
              <div>
                Order by{" "}
                <button
                  className="mx-2 button-8 shadow-none orderByAndBtns"
                  onClick={handleSortByDate}
                  style={{ filter: newestBtnClicked ? "brightness(85%)" : "" }}
                >
                  Newest
                </button>
                <button
                  onClick={handleSortByVotes}
                  style={{ filter: popularBtnClicked ? "brightness(85%)" : "" }}
                  className="button-8 shadow-none orderByAndBtns"
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
            {/* Displayed posts */}
            <div className="row">
              {Array.isArray(slicedData) && slicedData.length !== 0 ? (
                slicedData.map((post, index) => (
                  <div className="col-12" key={index}>
                    <Card data={post} />
                  </div>
                ))
              ) : (
                // Display if search bar can't find anything
                <div className="row">
                  <div className="col">
                    <p>No results found on current page.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Single Card */}
          <div className="col-lg-2" style={{ marginTop: "80px" }}>
            <RecentCard data={data} />
          </div>
        </div>
        {/* Pagination */}
        <div className="row">
          <div className="col ">
            <div
              className="d-flex align-items-center pagination mb-5 justify-content-center"
              style={{ marginLeft: "-200px" }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="mx-2 button-4s"
              >
                Previous
              </button>
              <span className="darkMode">
                {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="mx-2 button-4s"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
