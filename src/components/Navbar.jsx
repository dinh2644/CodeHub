import React, { useState, useEffect } from "react";
import "../assets/Navbar.css";
import { Link } from "react-router-dom";
import DarkMode from "./DarkMode";
import LogoWhite from "../assets/logo-white.png";
import LogoBlack from "../assets/logo-black.png";

const Navbar = ({ handleChange }) => {
  const [search, setSearch] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // handle search bar from home page
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };
  const handleButtonClick = (e) => {
    e.preventDefault();
    handleChange(search);
  };

  //check for darkmode
  const checkIfDarkMode = (mode) => {
    setIsDarkMode(mode);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand" href="/">
            <img
              src={isDarkMode ? LogoWhite : LogoBlack}
              alt="CodeHub Logo"
              className="navbarLogo"
            />
          </a>

          {/* Collapsible button*/}
          <button
            className="navbar-toggler collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="toggler-icon top-bar"></span>
            <span className="toggler-icon middle-bar"></span>
            <span className="toggler-icon bottom-bar"></span>
          </button>

          {/* Your collapsed button content */}
          <div
            className="collapse navbar-collapse "
            id="navbarSupportedContent"
          >
            {/* Search bar */}
            <form className="d-flex mx-auto my-2 my-lg-0" id="myform">
              <input
                className="form-control shadow-none"
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleInputChange}
                id="searchQueryInput"
              />
              <button
                className="btn btn-outline-success"
                type="submit"
                onClick={handleButtonClick}
                id="searchQuerySubmit"
                aria-label="Button"
              >
                <svg
                  style={{ width: "24px", height: "24px" }}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#666666"
                    d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                  />
                </svg>
              </button>
            </form>
            {/* Home/Ask Question Buttons */}
            <ul className="navbar-nav ">
              <li className="nav-item">
                <Link
                  className="nav-link navbarBtns active"
                  aria-current="page"
                  to={"/"}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link navbarBtns" to={"/askquestion"}>
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
