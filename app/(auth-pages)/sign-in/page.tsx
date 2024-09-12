import { signInAction } from '@/app/actions';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Login() {
  return (
    <form action={signInAction} className=''>
      <GoogleSignInButton />
    </form>
  );
}
