import React, { useState, useEffect } from "react";
import { createBatch } from "@/services/batchService";
import axios from "axios";

const AddBatch = ({ onClose, onBatchAdded }) => {
  const [batchName, setBatchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    fetchInstructors();
  }, []);

  // Fetch instructors
  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/instructors"
      );
      setInstructors(response.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  // Handle batch creation
  const handleCreateBatch = async () => {
    if (!batchName || !startDate || !endDate || !selectedInstructor) {
      alert("Please fill all fields");
      return;
    }

    try {
      const newBatch = await createBatch({
        name: batchName,
        startDate,
        endDate,
        instructor: selectedInstructor,
      });

      onBatchAdded(newBatch); // Update UI in parent component
      onClose(); // Close modal
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Create New Batch</h2>
        <input
          type="text"
          placeholder="Batch Name"
          className="border p-2 w-full my-2"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 w-full my-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 w-full my-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <select
          className="border p-2 w-full my-2"
          value={selectedInstructor}
          onChange={(e) => setSelectedInstructor(e.target.value)}
        >
          <option value="">Select Instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={handleCreateBatch}
          >
            Save Batch
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded-lg ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;
