import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();
  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };
  return (
    <div className="flex items-center justify-between bg-[#C70039] text-white cursor-pointer hover:bg-black dark:hover:text-[#C70039] px-4 py-2 rounded-md my-2">
      <h1 className="font-bold text-white dark:hover:text-[#C70039]">
        Lecture - {index + 1}: {lecture.lectureTitle}
      </h1>
      <Edit
        onClick={goToUpdateLecture}
        size={20}
        className="cursor-pointer text-white-600 dark:hover:text-[#C70039]"
      />
    </div>
  );
};

export default Lecture;
