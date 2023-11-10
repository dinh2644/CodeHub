import React, { useState, useEffect } from "react";
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

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route index={true} element={<HomePage data={posts} />} />
            <Route path="/askquestion" element={<CreatePage />} />
            <Route path="/update" element={<UpdatePage />} />
            <Route path="/:id" element={<DetailedPage data={posts} />} />
          </Route>
          {/* Handle unknown URLs */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
