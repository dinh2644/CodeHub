import React, { useState } from "react";
import "../assets/Navbar.css";
import { Link } from "react-router-dom";

const Navbar = ({ handleChange }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container navContainer">
          <Link className="navbar-brand item" to={"/"}>
            Stack Underflow
          </Link>

          <form className="item d-flex" id="myform">
            <input
              className="form-control"
              type="search"
              placeholder="Search"
              aria-label="Search"
              onChange={handleChange}
            />
            <button
              className="btn btn-outline-success"
              type="submit"
              onClick={handleChange}
            >
              Search
            </button>
          </form>
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
