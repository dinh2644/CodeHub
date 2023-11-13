import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
// Others
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./App.css";
import { supabase } from "./client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Import pages
import Navbar from "./components/Navbar";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import UpdatePage from "./pages/UpdatePage";
import DetailedPage from "./pages/DetailedPage";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [userID, setUserID] = useState("");

  // generate random userid and assign to userID on launch
  // useEffect(() => {
  //   const assignRandomUserId = async () => {
  //     const randomId = uuidv4();

  //     // insert new random id into Users table
  //     const { error } = await supabase
  //       .from("Users")
  //       .insert({ user_id: randomId });

  //     if (error) {
  //       console.error(error);
  //     } else {
  //       setUserID(randomId);
  //     }
  //   };
  //   assignRandomUserId();
  // }, []);

  // fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select()
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  // handle search
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar handleChange={handleSearch} />
                <Outlet />
              </>
            }
          >
            <Route
              index={true}
              element={
                <HomePage data={posts} searchQuery={query} userId={userID} />
              }
            />
            <Route path="/askquestion" element={<CreatePage />} />
            <Route path="/update/:id" element={<UpdatePage data={posts} />} />
            <Route
              path="/:id"
              element={<DetailedPage data={posts} userId={userID} />}
            />
          </Route>
          {/* Handle unknown URLs */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
