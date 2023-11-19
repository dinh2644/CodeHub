import React, { useState } from "react";
import Sun from "../assets/Sun.svg?react";
import Moon from "../assets/Moon.svg?react";
import "../assets/DarkMode.css";

const DarkMode = ({ setMode }) => {
  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    setMode(true);
    localStorage.setItem("selectedTheme", "dark");
  };
  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    setMode(false);
    localStorage.setItem("selectedTheme", "light");
  };

  const selectedTheme = localStorage.getItem("selectedTheme");

  if (selectedTheme === "dark") {
    setDarkMode();
  }

  const toggleTheme = (e) => {
    if (e.target.checked) {
      setDarkMode();
      setMode(true);
    } else {
      setLightMode();
      setMode(false);
    }
  };

  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
