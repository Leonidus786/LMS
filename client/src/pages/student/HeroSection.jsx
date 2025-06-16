import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  console.log("HeroSection: Rendering");

  return (
    <div className="relative bg-gradient-to-r from-[#C70039] to-[#C70039] dark:from-gray-800 dark:to-gray-900 py-18 px-2 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-2">
          Find the Best Courses for You
        </h1>
        <p className="text-white dark:text-white mb-8">
          Discover, Learn, and Upskill with our wide range of courses
        </p>

        <form onSubmit={searchHandler}>
          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="flex justify-center items-center space-x-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Courses"
                className="border-none focus-visible:ring-0 px-6 py-3 text-black bg-white dark:text-gray-100 rounded-full shadow-lg overflow-hidden max-w-xl"
                style={{ width: "400px", fontSize: "0.875rem" }}
              />
              <Button
                type="submit"
                className="bg-[#C70039] text-white px-6 py-3 rounded-full hover:bg-black"
                style={{ fontSize: "0.875rem" }}
              >
                Search
              </Button>
            </div>
            <Button
              type="button"
              onClick={() => navigate(`/course/search?query`)}
              className="bg-[#C70039] text-white px-6 py-3 rounded-full hover:bg-black"
              style={{ fontSize: "0.875rem" }}
            >
              Explore Courses
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;
