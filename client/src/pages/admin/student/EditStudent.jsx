import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useUpdateStudentMutation } from "@/features/api/studentApi";
import { toast } from "sonner";

const EditStudent = ({ student, onStudentUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    name: student.name,
    email: student.email,
    phoneNumber: student.phoneNumber || "",
  });
  const [updateStudent, { isLoading }] = useUpdateStudentMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudent({ id: student._id, ...formData }).unwrap();
      toast.success("Student updated successfully.");
      onStudentUpdated();
      onClose(); // Close modal after updating
    } catch (err) {
      toast.error(
        "Failed to update student: " + (err?.data?.message || err.message)
      );
      console.error("Update student error:", err);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Edit Student</DialogTitle>
        <DialogDescription>
          Update the details for {student.name}.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Student Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number (e.g., +1234567890)"
            required
          />
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            className="bg-gray-400 text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Student"
            )}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default EditStudent;
