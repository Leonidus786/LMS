import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import {
  useGetAllStudentsQuery,
  useDeleteStudentMutation,
} from "@/features/api/studentApi";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";

const StudentManagement = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, error, isFetching } = useGetAllStudentsQuery();
  const students = data?.students || [];
  const [deleteStudent] = useDeleteStudentMutation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Role-based access control
  React.useEffect(() => {
    if (user && user.role !== "instructor") {
      navigate("/"); // Redirect non-admins to the homepage
    }
  }, [user, navigate]);

  console.log("StudentManagement rendering...");
  console.log("useGetAllStudentsQuery state:", {
    isLoading,
    isFetching,
    error,
    data,
    students,
  });

  const handleStudentAdded = () => {
    console.log("Student added, refreshing list...");
  };

  const handleStudentUpdated = () => {
    console.log("Student updated, refreshing list...");
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id).unwrap();
      toast.success("Student deleted successfully.");
    } catch (err) {
      toast.error(
        "Failed to delete student: " + (err?.data?.message || err.message)
      );
      console.error("Delete student error:", err);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="text-center p-6 text-gray-900 dark:text-white">
        Loading students...
      </div>
    );
  }

  if (error) {
    console.log("Error state:", error);
    if (error.status === 401) {
      navigate("/login");
      return null;
    }
    return (
      <div className="text-center p-6 text-gray-900 dark:text-white">
        Error loading students: {error?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Management
          </h2>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C70039] text-white hover:bg-black dark:hover:text-[#C70039] px-4 py-2 rounded-lg"
          >
            Add Student
          </Button>
        </div>

        {/* Student Table or No Students Message */}
        {students.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              No students found. Add a student to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-900 dark:text-white">
                    Name
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white">
                    Email
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white">
                    Phone Number
                  </TableHead>
                  <TableHead className="text-gray-900 dark:text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="text-gray-900 dark:text-white">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {student.phoneNumber || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setEditingStudent(student);
                          setIsEditModalOpen(true);
                        }}
                        className="bg-blue-600 text-white hover:bg-blue-700 mr-2 px-3 py-1 rounded-md"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(student._id)}
                        className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded-md"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Add Student Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <span></span>
          </DialogTrigger>
          <DialogContent>
            <AddStudent
              onStudentAdded={handleStudentAdded}
              onClose={() => setIsAddModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Student Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <span></span>
          </DialogTrigger>
          <DialogContent>
            {editingStudent && (
              <EditStudent
                student={editingStudent}
                onStudentUpdated={handleStudentUpdated}
                onClose={() => setIsEditModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentManagement;
