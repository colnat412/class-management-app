'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getEmailForVerification } from '@/helpers/get-email-verify';
import { User } from '@/types/user.interface';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const Password = () => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const email =
        getEmailForVerification() ||
        new URLSearchParams(window.location.search).get('email');

      if (!email) {
        toast.error('Email not found. Please go back to login.');
        router.push('/login');
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/check-verification-status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setIsVerified(data.isVerified);
      } else {
        toast.error('Failed to check verification status');
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      toast.error('Error checking verification status');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (password: string) => {
    setIsLoading(true);
    try {
      const email =
        getEmailForVerification() ||
        new URLSearchParams(window.location.search).get('email');

      if (!email) {
        toast.error('Email not found');
        return;
      }

      const endpoint = isVerified
        ? `${process.env.NEXT_PUBLIC_API_URL}/auth/login`
        : `${process.env.NEXT_PUBLIC_API_URL}/auth/create-password`;

      const requestBody = { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok) {
        const userData = data.data as User;

        if (isVerified) {
          toast.success('Login successful!');
          localStorage.setItem('token', data.token || '');
        } else {
          toast.success(data.message || 'Password created successfully');

          try {
            const loginRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              }
            );
            const loginData = await loginRes.json();

            if (loginRes.ok) {
              localStorage.setItem('token', loginData.token || '');
            }
          } catch (loginError) {
            console.error(
              'Error during login after password creation:',
              loginError
            );
          }
        }

        localStorage.removeItem('email');
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.role === 'student') {
          router.push('/student/manage-lesson');
        } else {
          router.push('/instructor/manage-student');
        }
      } else {
        toast.error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isCheckingStatus ? (
        <div className="flex items-center justify-center flex-col gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Checking verification status...</span>
        </div>
      ) : (
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
            <span className="text-3xl font-semibold">
              {isVerified ? 'Login' : 'Create Password'}
            </span>
            <span className="text-sm opacity-50">
              {isVerified
                ? 'Enter your password to login'
                : 'Please create a password to continue'}
            </span>
          </div>
          <div className="flex flex-col gap-4 w-full justify-center items-center">
            <Input
              className="w-3/4 py-6"
              type="password"
              placeholder={
                isVerified ? 'Enter your password' : 'Create your password'
              }
              onChange={handleCodeChange}
              value={code}
            />
            <Button
              variant={'default'}
              className="w-3/4 p-4 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white"
              onClick={() => handleSubmit(code)}
              disabled={isLoading || !code.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : isVerified ? (
                'Login'
              ) : (
                'Create Password'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Password;
