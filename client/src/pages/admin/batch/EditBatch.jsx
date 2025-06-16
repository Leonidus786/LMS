import React, { useState, useEffect } from "react";
import { updateBatch } from "@/services/batchService"; // ✅ Ensure correct import
import axios from "axios";

const EditBatch = ({ batch, onClose, onBatchUpdated }) => {
  const [batchName, setBatchName] = useState(batch.batchName);
  const [startDate, setStartDate] = useState(batch.startDate);
  const [endDate, setEndDate] = useState(batch.endDate);
  const [selectedInstructor, setSelectedInstructor] = useState(
    batch.instructor?._id || ""
  );
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ Loading state

  useEffect(() => {
    fetchInstructors();
  }, []);

  // ✅ Fetch instructors from API
  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/instructors"
      );
      setInstructors(response.data);
    } catch (error) {
      console.error("❌ Error fetching instructors:", error);
    }
  };

  // ✅ Handle batch update
  const handleUpdateBatch = async () => {
    if (!batchName || !startDate || !endDate || !selectedInstructor) {
      alert("⚠️ Please fill all fields before updating.");
      return;
    }

    setLoading(true); // ✅ Show loading state
    const token = localStorage.getItem("token"); // ✅ Ensure token is passed

    try {
      const updatedData = {
        batchName,
        startDate,
        endDate,
        instructor: selectedInstructor,
      };

      const result = await updateBatch(batch._id, updatedData, token);

      if (result) {
        onBatchUpdated(); // ✅ Refresh the batch list
        onClose(); // ✅ Close modal
      }
    } catch (error) {
      console.error("❌ Error updating batch:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Batch</h2>

        <input
          type="text"
          className="border p-2 w-full my-2"
          value={batchName}
          onChange={(e) => setBatchName(e.target.value)}
          placeholder="Batch Name"
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
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleUpdateBatch}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Batch"}
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

export default EditBatch;
