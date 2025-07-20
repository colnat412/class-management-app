import Login from '@/containers/auth/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Class Management App | Sign In',
  description: 'Login to your account',
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
