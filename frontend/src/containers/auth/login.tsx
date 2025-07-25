'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3030/api';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleBack = () => {
    router.back();
  };

  const handleSignIn = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/sign-in-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log('Response from server:', data.user.verified);

      if (res.ok) {
        localStorage.setItem('email', email);
        if (!data.user.verified) {
          toast.success(data.message || 'Code sent to your email');
          router.push('/verify');
        } else {
          router.push('/password');
        }
      } else {
        toast.error(data.error || 'Failed to send code');
        console.error('Sign in failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center flex-col w-1/4 gap-10 border shadow-sm px-4 py-8 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <Button
            onClick={handleBack}
            className="flex justify-start items-center w-full hover:cursor-pointer"
            variant="link"
          >
            <ArrowLeft />
            Back
          </Button>
          <span className="text-3xl font-semibold">Sign In</span>
          <span className="text-sm opacity-50">
            Please enter your email to sign in
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <Input
            className="w-3/4 py-6"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <Button
            onClick={() => handleSignIn(email)}
            variant={'default'}
            className="w-3/4 p-4 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>
        <div className="flex flex-row justify-start items-center w-3/4 self-center mt-2">
          <span className="text-sm">Do not have an account?</span>
          <Button
            className="text-blue-500 px-1 hover:cursor-pointer font-manrope"
            variant="link"
          >
            Sign up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
