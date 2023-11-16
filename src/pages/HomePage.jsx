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
  const [postsPerPage] = useState(5);
  const [isAllPostsSelected, setIsAllPostsSelected] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // load data depending on whats in search bar
  useEffect(() => {
    const filteredData = data.filter((post) =>
      String(post.title).toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPosts(filteredData);
  }, [data, searchQuery]);

  // Logic for filtering by tags
  const filterByTags = (selectedTag) => {
    setSelectedTags(selectedTag);
    if (selectedTag === "") {
      setCurrentPage(1); // Reset to first page when "All Posts" is selected
      setFilteredPosts([]); // Clear filtered posts
    } else {
      const filteredData = posts.filter((post) => {
        if (selectedTag === "code") {
          return post.code !== null && post.code !== "";
        } else if (selectedTag === "image") {
          return post.image !== null && post.image !== "";
        } else if (selectedTag === "general") {
          return !(post.image || post.code);
        }
        return true;
      });
      setCurrentPage(1); // Reset to first page when a tag is selected
      setFilteredPosts(filteredData); // Set filtered posts
    }
  };

  // Logic for pagination
  const currentPosts = selectedTags ? filteredPosts : posts;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPostsSlice = currentPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  //const displayedPosts = filteredByTags.length > 0 ? filteredByTags : posts;

  return (
    <>
      <div className="container">
        <div className="row">
          {/* Left Section - Mapped Posts */}
          <div className="col-9 mt-4 mb-4">
            {/* Sort buttons and select tags */}
            <div
              className="d-flex justify-content-between mb-4"
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
                onChange={(e) => filterByTags(e.target.value)}
              >
                <option value="">All Posts</option>
                <option value="code">With Code</option>
                <option value="image">With Image</option>
                <option value="general">General Discussion</option>
              </select>
            </div>
            {/* Displayed posts */}
            <div className="row">
              {Array.isArray(currentPostsSlice) &&
              currentPostsSlice.length !== 0 ? (
                currentPostsSlice.map((post, index) => (
                  <div className="col-12" key={index}>
                    <Card data={post} />
                  </div>
                ))
              ) : (
                // Display if search bar can't find anything
                <div className="row">
                  <div className="col">
                    <p>No results found for your search.</p>
                  </div>
                </div>
              )}
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-center align-items-center">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-link"
              >
                Back
              </button>
              <p className="mx-3 mb-0">
                Page {currentPage} of{" "}
                {Math.ceil(currentPosts.length / postsPerPage)}
              </p>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={
                  currentPage === Math.ceil(currentPosts.length / postsPerPage)
                }
                className="btn btn-link"
              >
                Next
              </button>
            </div>
          </div>

          {/* Right Section - Single Card */}
          <div className="col-3" style={{ marginTop: "80px" }}>
            <RecentCard data={data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
