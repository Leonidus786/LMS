import { useEffect, useState } from "react";
import AddInstructor from "./AddInstructor";
import EditInstructor from "./EditInstructor";
import { Button } from "@/components/ui/button"; // ✅ Import UI button
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const InstructorManagement = () => {
  const [instructors, setInstructors] = useState([]);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/instructors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch instructors");

      const data = await response.json();
      setInstructors(data.instructors || []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Instructor Management
      </h2>

      {/* ✅ Add Instructor Button */}
      <Button
        className="bg-[#C70039] text-white hover:bg-black dark:hover:text-[#C70039] mb-4"
        onClick={() => setShowAddModal(true)}
      >
        ➕ Add Instructor
      </Button>

      {/* ✅ Instructor Table */}
      <Table className="w-full border dark:border-gray-700">
        <TableHeader>
          <TableRow className="bg-gray-200 dark:bg-gray-800">
            <TableHead className="p-3">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map((inst) => (
            <TableRow key={inst._id} className="border-b dark:border-gray-700">
              <TableCell className="p-3">{inst.name}</TableCell>
              <TableCell>{inst.email}</TableCell>
              <TableCell>
                <Button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  onClick={() => {
                    setEditingInstructor(inst);
                    setShowEditModal(true);
                  }}
                >
                  ✏️ Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ✅ Add Instructor Modal */}
      {showAddModal && (
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <AddInstructor
              onInstructorAdded={fetchInstructors}
              onClose={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* ✅ Edit Instructor Modal */}
      {showEditModal && editingInstructor && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <EditInstructor
              instructor={editingInstructor}
              onInstructorUpdated={fetchInstructors}
              onClose={() => setShowEditModal(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InstructorManagement;
