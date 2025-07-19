import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex items-center justify-center flex-col w-1/4 gap-10 border shadow-sm px-4 py-8 rounded-lg">
        <div className="flex flex-col items-center justify-center gap-3 w-full">
          <span className="text-3xl font-semibold">Sign In</span>
          <span className="text-sm opacity-50">
            Please enter your email to sign in
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <Input className="w-3/4 py-6" type="email" placeholder="Email" />
          <Button
            variant={'default'}
            className="w-3/4 p-4 bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white"
          >
            Next
          </Button>
        </div>
        <div className="flex flex-row justify-start items-center w-3/4 self-center mt-2">
          <span className="text-sm">Don't have an account?</span>
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
