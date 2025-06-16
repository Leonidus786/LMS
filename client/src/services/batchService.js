import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/batches"; // Adjust port if needed

// Fetch all batches
const getAllBatches = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching batches:", error);
    throw error; // Ensure errors are properly handled
  }
};

// Create a new batch
const createBatch = async (batchData, token) => {
  try {
    const response = await axios.post(`${API_URL}/create`, batchData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating batch:", error);
    throw error;
  }
};

// ✅ Add updateBatch function
const updateBatch = async (batchId, batchData, token) => {
  try {
    const response = await axios.put(`${API_URL}/edit/${batchId}`, batchData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating batch:", error);
    throw error;
  }
};

// Add students to batch
const addStudentsToBatch = async (batchId, studentIds, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/add-students`,
      { batchId, studentIds },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding students to batch:", error);
    throw error;
  }
};

// ✅ Named exports
export { getAllBatches, createBatch, updateBatch, addStudentsToBatch };

// ✅ Default export as an object
export default {
  getAllBatches,
  createBatch,
  updateBatch, // ✅ Ensure updateBatch is included
  addStudentsToBatch,
};
