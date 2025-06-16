import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "diploma in digital marketing", label: "Diploma In Digital Marketing" },
  { id: "digital marketing", label: "Digital Marketing" },
  { id: "diploma in data science", label: "Diploma in Data Science" },
  {
    id: "diploma in ai & machine learning",
    label: "Diploma in AI & Machine Learning",
  },
  { id: "diploma in ui/ux", label: "Diploma in UI/UX" },
  { id: "fullstack development", label: "Fullstack Development" },
  { id: "python development", label: "Python Development" },
  {
    id: "data analytics & business analytics",
    label: "Data Analytics & Business Analytics",
  },
  {
    id: "data structures and algorithm",
    label: "Data Structures and Algorithm",
  },
  { id: "data visualization", label: "Data Visualization" },
  { id: "generative ai", label: "Generative AI" },
  { id: "stock market", label: "Stock Market" },
];

// eslint-disable-next-line react/prop-types
const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];

      handleFilterChange(newCategories, sortByPrice);
      return newCategories;
    });
  };

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue);
    handleFilterChange(selectedCategories, selectedValue);
  };

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler} value={sortByPrice}>
          <SelectTrigger className="w-[180px] bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-[#C70039] text-white max-h-[300px] overflow-y-auto">
            <SelectGroup>
              <SelectLabel className="text-white">Sort by price</SelectLabel>
              <SelectItem
                value="low"
                className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
              >
                Low to High
              </SelectItem>
              <SelectItem
                value="high"
                className="cursor-pointer hover:bg-black dark:hover:text-[#C70039]"
              >
                High to Low
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories.map((category) => (
          <div key={category.id} className="flex items-center space-x-2 my-2">
            <Checkbox
              id={category.id}
              onCheckedChange={() => handleCategoryChange(category.id)}
            />
            <Label
              htmlFor={category.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {category.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
