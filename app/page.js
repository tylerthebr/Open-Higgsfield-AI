import { redirect } from 'next/navigation';

// Redirect to studio page on load
// Could change this to '/dashboard' or '/home' if we add those routes later
export default function Home() {
  redirect('/studio');
}
