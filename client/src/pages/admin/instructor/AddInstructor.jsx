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

const AddInstructor = ({ onInstructorAdded, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/v1/instructors/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, email }),
        }
      );

      if (response.ok) {
        onInstructorAdded();
        setName("");
        setEmail("");
        onClose(); // Close modal after adding
      } else {
        console.error("Failed to add instructor");
      }
    } catch (error) {
      console.error("Error adding instructor:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">Add Instructor</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new instructor.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Instructor Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
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
            className="bg-[#C70039] text-white hover:bg-black dark:hover:text-[#C70039]"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Instructor"
            )}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default AddInstructor;
