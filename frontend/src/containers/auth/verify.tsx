'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getEmailForVerification } from '@/helpers/get-email-verify';
import { User } from '@/types/user.interface';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const Verify = () => {
  const [code, setCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleCodeChang = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (code: string) => {
    setIsLoading(true);
    try {
      const email =
        getEmailForVerification() ||
        new URLSearchParams(window.location.search).get('email');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code }),
        }
      );
      const data = await res.json();
      console.log('Response from verify:', data);
      const userData = data.data as User;
      if (res.ok) {
        toast.success(data.message || 'Code verified successfully');
        localStorage.removeItem('email');
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.role === 'student') {
          router.push('/student/manage-lesson');
        } else {
          router.push('/instructor/manage-student');
        }
      }
    } catch (error) {
      console.error('Error during code verification:', error);
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
          <span className="text-3xl font-semibold">Email vertification</span>
          <span className="text-sm opacity-50">
            Please enter your code that send to your email
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <Input
            className="w-3/4 py-6"
            type="text"
            placeholder="Enter your code"
            onChange={handleCodeChang}
          />
          <Button
            variant={'default'}
            className="w-3/4 p-4 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white"
            onClick={() => handleSubmit(code)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
        <div className="flex flex-row justify-start items-center w-3/4 self-center mt-2">
          <span className="text-sm">Code not received?</span>
          <Button
            className="text-blue-500 px-1 hover:cursor-pointer font-manrope"
            variant="link"
          >
            Send again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verify;
