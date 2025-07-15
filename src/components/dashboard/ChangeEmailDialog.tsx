import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChangeEmailDialog({ open, onOpenChange }: ChangeEmailDialogProps) {
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!newEmail) {
      setError("Please enter your new email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setLoading(false);
    if (error) {
      setError(error.message || "Failed to change email address.");
    } else {
      setSuccess("A confirmation link has been sent to your old email address. Please check your inbox and click the link to complete the update. Your email will not be changed until you confirm.");
      setNewEmail("");
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
      }, 4000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-8 rounded-2xl bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-2 text-[#254F70]">Update your email address</DialogTitle>
          <DialogDescription className="text-center mb-6 text-base text-gray-700">
            Enter your new email address below to update your account
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleChangeEmail} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-900">New email address</label>
            <div className="relative">
              <Input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="Enter new email address"
                className="pr-10 border-gray-300 focus:border-[#254F70] focus:ring-2 focus:ring-[#254F70] bg-white text-gray-900 placeholder-gray-400"
                required
              />
              <Mail className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
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
              {loading ? "Updating..." : "UPDATE EMAIL ADDRESS"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 