import { redirect } from 'next/navigation';

// Redirect to studio page on load
// Could change this to '/dashboard' or '/home' if we add those routes later
// TODO: maybe add a landing page here someday with project info
export default function Home() {
  redirect('/studio');
}
