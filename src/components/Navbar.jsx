import React, { useState } from "react";
import "../assets/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ handleChange }) => {
  const [search, setSearch] = useState("");

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    handleChange(search);
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container navContainer">
          {/* Logo */}
          <Link className="navbar-brand item" to={"/"}>
            Stack Underflow
          </Link>
          {/* Search bar */}
          <form className="item d-flex" id="myform">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={handleInputChange}
            />
            <button
              className="btn btn-outline-success"
              type="submit"
              onClick={handleButtonClick}
            >
              Search
            </button>
          </form>
          {/* Home & Ask Question Buttons */}
          <div className="item hide-on-mobile">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to={"/"}>
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/askquestion"}>
                  Ask Question
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
