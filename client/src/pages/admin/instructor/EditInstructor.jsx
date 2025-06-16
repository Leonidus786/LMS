import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react"; // ✅ Loading indicator

const EditInstructor = ({ instructor, onInstructorUpdated, onClose }) => {
  const [name, setName] = useState(instructor.name);
  const [email, setEmail] = useState(instructor.email);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/v1/instructors/edit/${instructor._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (response.ok) {
        onInstructorUpdated();
        onClose(); // Close modal after updating
      } else {
        console.error("Failed to update instructor");
      }
    } catch (error) {
      console.error("Error updating instructor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Edit Instructor</DialogTitle>
        <DialogDescription>Update the instructor's details.</DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Instructor Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Instructor"
            )}
          </Button>
        </DialogFooter>
      </div>
    </div>
  );
};

export default EditInstructor;
