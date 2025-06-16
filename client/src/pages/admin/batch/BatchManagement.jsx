import React, { useState, useEffect } from "react";
import axios from "axios";
import AddBatch from "./AddBatch"; // ✅ Import AddBatch
import EditBatch from "./EditBatch"; // ✅ Import EditBatch
import { getAllBatches } from "@/services/batchService";

const BatchManagement = () => {
  const [batches, setBatches] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getAllBatches();
      setBatches(data);
    } catch (error) {
      console.error("❌ Error fetching batches:", error);
    }
  };

  return (
    <div className="p-6 mt-50">
      <h1 className="text-2xl font-bold mb-4">Batch Management</h1>

      {/* Create Batch Button */}
      <button
        className="bg-red-600 text-white px-4 py-2 rounded-lg"
        onClick={() => setShowAddModal(true)}
      >
        Create New Batch
      </button>

      {/* Batch Table */}
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Batch Name</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">Instructor</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch._id} className="border">
              <td className="p-2 border">{batch.batchName}</td>
              <td className="p-2 border">{batch.startDate}</td>
              <td className="p-2 border">
                {batch.instructor?.name || "Not Assigned"}
              </td>
              <td className="p-2 border">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-md"
                  onClick={() => {
                    setEditingBatch(batch);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {showAddModal && (
        <AddBatch
          onClose={() => setShowAddModal(false)}
          onBatchAdded={fetchBatches}
        />
      )}

      {showEditModal && editingBatch && (
        <EditBatch
          batch={editingBatch}
          onClose={() => setShowEditModal(false)}
          onBatchUpdated={fetchBatches}
        />
      )}
    </div>
  );
};

export default BatchManagement;
