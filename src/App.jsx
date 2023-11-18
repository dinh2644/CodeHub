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
import "./App.css";
import Loading from "./components/Loading";
// Import pages
import Navbar from "./components/Navbar";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import UpdatePage from "./pages/UpdatePage";
import DetailedPage from "./pages/DetailedPage";
import { Toaster, toast } from "react-hot-toast";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // fetch posts
  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select()
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setIsLoading(false);
        setPosts(data);
      }
    };
    fetchPosts();

    // display toast messages
    const toastMessage = localStorage.getItem("toast");
    if (toastMessage) {
      toast.success(toastMessage);
      localStorage.removeItem("toast");
    }
  }, []);

  // handle search
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      {isLoading ? (
        <Loading />
      ) : (
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
                element={<HomePage data={posts} searchQuery={query} />}
              />
              <Route path="/askquestion" element={<CreatePage />} />
              <Route path="/update/:id" element={<UpdatePage data={posts} />} />
              <Route path="/:id" element={<DetailedPage data={posts} />} />
            </Route>
            {/* Handle unknown URLs */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      )}
    </>
  );
};

export default App;
