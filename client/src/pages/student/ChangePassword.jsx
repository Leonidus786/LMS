import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "@/features/api/studentApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await changePassword({ newPassword }).unwrap();
      toast.success("Password changed successfully.");
      navigate("/profile"); // Redirect to profile after changing password
    } catch (err) {
      toast.error(
        "Failed to change password: " + (err?.data?.message || err.message)
      );
      console.error("Change password error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
        <p className="text-gray-600 mb-4">
          You must change your temporary password before proceeding.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Changing..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
