// D:\lms\client\src\components\DateTimePicker.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the default styles
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns"; // Import the format function

// Custom styles to match the light theme
const customStyles = `
  .react-datepicker-wrapper {
    width: 100%;
  }
  .react-datepicker__input-container input {
    width: 280px;
    padding: 8px 12px;
    border: 1px solid #d1d5db; /* border-gray-300 */
    border-radius: 4px;
    background-color: #ffffff; /* bg-white */
    color: #000000; /* text-black */
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .react-datepicker__input-container input:focus {
    border-color: #C70039; /* focus:border-[#C70039] */
  }
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #d1d5db; /* border-gray-300 */
    background-color: #ffffff; /* bg-white */
    color: #000000; /* text-black */
  }
  .react-datepicker__header {
    background-color: #f3f4f6; /* bg-gray-100 */
    border-bottom: 1px solid #d1d5db; /* border-gray-300 */
    color: #000000; /* text-black */
  }
  .react-datepicker__day-name,
  .react-datepicker__day,
  .react-datepicker__time-name {
    color: #000000; /* text-black */
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #C70039; /* bg-[#C70039] */
    color: #ffffff; /* text-white */
  }
  .react-datepicker__day:hover {
    background-color: #e5e7eb; /* hover:bg-gray-200 */
  }
  .react-datepicker__time-container {
    border-left: 1px solid #d1d5db; /* border-gray-300 */
    background-color: #ffffff; /* bg-white */
  }
  .react-datepicker__time-box {
    background-color: #ffffff; /* bg-white */
  }
  .react-datepicker__time-list-item {
    color: #000000; /* text-black */
  }
  .react-datepicker__time-list-item:hover {
    background-color: #e5e7eb; /* hover:bg-gray-200 */
  }
  .react-datepicker__time-list-item--selected {
    background-color: #C70039 !important; /* bg-[#C70039] */
    color: #ffffff !important; /* text-white */
  }
`;

export function DateTimePicker({ value, onChange }) {
  const [selectedDate, setSelectedDate] = useState(
    value ? new Date(value) : null
  );

  useEffect(() => {
    onChange(selectedDate);
  }, [selectedDate, onChange]);

  return (
    <div className="relative">
      <style>{customStyles}</style>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          console.log("Selected date and time:", date); // Debug log
          setSelectedDate(date);
        }}
        showTimeSelect
        timeFormat="h:mm aa"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        placeholderText="Pick a date and time"
        className="w-[280px] p-2 border border-gray-300 rounded-md bg-white text-black focus:border-[#C70039]"
        customInput={
          <div className="relative">
            <input
              value={
                selectedDate ? format(selectedDate, "MMMM d, yyyy h:mm aa") : ""
              }
              placeholder="Pick a date and time"
              className="w-[280px] p-2 border border-gray-300 rounded-md bg-white text-black focus:border-[#C70039]"
              readOnly
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        }
      />
    </div>
  );
}
