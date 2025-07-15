import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MIN_PASSWORD_LENGTH = 8;

export default function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    // Remove min length validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) {
      setError(error.message || "Failed to change password.");
    } else {
      setSuccess("Password changed successfully.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
      }, 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8 rounded-2xl bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-2 text-[#254F70]">Change your password</DialogTitle>
          <DialogDescription className="text-center mb-6 text-base text-gray-700">
            Enter a new password below to change your password
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleChangePassword} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-900">New password</label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="pr-10 border-gray-300 focus:border-[#254F70] focus:ring-2 focus:ring-[#254F70] bg-white text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#254F70]"
                tabIndex={-1}
                onClick={() => setShowNew(v => !v)}
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-900">Confirm password</label>
            <div className="relative">
              <Input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="pr-10 border-gray-300 focus:border-[#254F70] focus:ring-2 focus:ring-[#254F70] bg-white text-gray-900 placeholder-gray-400"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#254F70]"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="default">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-[#254F70] text-white font-bold text-base py-2 rounded-lg hover:bg-[#1e3a56] transition-colors shadow-sm"
              disabled={loading}
            >
              {loading ? "Changing..." : "CHANGE PASSWORD"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 