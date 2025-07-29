import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import logo2 from '../../public/logo2.png';
import { supabase } from "../lib/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:8080/reset-password"
    });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("If an account with that email exists, a password reset link has been sent.");
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
                Forgot Password
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-600">
                Enter your email address to receive a password reset link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="h-11 sm:h-12 text-sm sm:text-base"
                  />
                </div>
                {message && <div className="text-green-600 text-sm">{message}</div>}
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <Button type="submit" className="w-full bg-[#254F70] hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
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

export default ForgotPassword; 