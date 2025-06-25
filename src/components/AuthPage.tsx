
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, BookOpen, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && !fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        console.log('Starting sign up process...');
        const { error } = await signUp(email, password, fullName);
        
        if (error) {
          console.error('Sign up error:', error);
          let errorMessage = "Failed to create account. Please try again.";
          
          if (error.message?.includes('already registered')) {
            errorMessage = "An account with this email already exists. Try signing in instead.";
          } else if (error.message?.includes('Invalid email')) {
            errorMessage = "Please enter a valid email address.";
          } else if (error.message?.includes('Password')) {
            errorMessage = "Password must be at least 6 characters long.";
          }
          
          toast({
            title: "Sign Up Error",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration.",
          });
          // Clear form
          setEmail('');
          setPassword('');
          setFullName('');
        }
      } else {
        console.log('Starting sign in process...');
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error);
          let errorMessage = "Invalid email or password. Please try again.";
          
          if (error.message?.includes('Invalid login credentials')) {
            errorMessage = "Invalid email or password. Please check your credentials and try again.";
          } else if (error.message?.includes('Email not confirmed')) {
            errorMessage = "Please check your email and click the confirmation link before signing in.";
          } else if (error.message?.includes('fetch')) {
            errorMessage = "Network error. Please check your connection and try again.";
          }
          
          toast({
            title: "Sign In Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
        // Note: Successful sign in will redirect automatically via useAuth
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (<CardHeader className="text-center space-y-4">
  <div className="flex justify-center">
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg overflow-hidden rounded-xl">
      <img 
        src="https:///file_00000000f50c61f99a99544a3edb87e7.png" 
        alt="StudySmart Students" 
        className="w-full h-auto object-cover"
      />
    </div>
  </div>
  <div className="flex justify-center">
    <div className="p-3 bg-purple-600 rounded-full">
      <BookOpen className="h-8 w-8 text-white" />
    </div>
  </div>
  <CardTitle className="text-2xl font-bold text-white">StudySmart</CardTitle>
  <p className="text-gray-400">
    {isSignUp ? 'Create your account' : 'Welcome back'}
  </p>
</CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    required={isSignUp}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
            </div>
            
            {!isSignUp && (
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-700/50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>
                  New user? Switch to sign up to create an account first.
                </span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} 
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  // Clear form when switching
                  setEmail('');
                  setPassword('');
                  setFullName('');
                }}
                className="text-purple-400 hover:text-purple-300 cursor-pointer ml-1 underline"
                disabled={loading}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
