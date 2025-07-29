import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logo2 from '../../public/logo2.png';
import { supabase } from "../lib/supabaseClient";

const ResetPassword = () => {
  const [accessToken, setAccessToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Parse access_token from URL hash
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const token = params.get("access_token");
    if (token) {
      setAccessToken(token);
      // Set the session for Supabase client
      supabase.auth.setSession({ access_token: token, refresh_token: token });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Your password has been updated. You can now log in with your new password.");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5faff] flex flex-col">
      <header className="w-full bg-white shadow-sm flex items-center justify-center px-3 sm:px-6 lg:px-8 py-3">
        <img
          src={logo2}
          alt="Community Simple Logo"
          className="h-8 sm:h-10 lg:h-12 w-auto"
          style={{ maxWidth: '120px' }}
        />
      </header>
      <main className="flex-1 flex items-center justify-center px-3 sm:px-4 py-4 sm:py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Reset Password
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Enter your new password below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              {accessToken ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="h-11 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      className="h-11 sm:h-12 text-sm sm:text-base"
                    />
                  </div>
                  {message && <div className="text-green-600 text-sm">{message}</div>}
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  <Button type="submit" className="w-full bg-[#254F70] hover:bg-primary/90" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              ) : (
                <div className="text-red-600 text-sm text-center">Invalid or missing reset token. Please use the link from your email.</div>
              )}
              <div className="text-center mt-4">
                <Link to="/login" className="text-xs text-blue-600 hover:underline hover:text-blue-800 font-medium">
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword; 