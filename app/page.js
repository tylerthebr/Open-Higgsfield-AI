import { redirect } from 'next/navigation';

// Redirect to studio page on load
// Could change this to '/dashboard' or '/home' if we add those routes later
// TODO: maybe add a landing page here someday with project info
// NOTE: changed redirect target to '/studio' from default - keeping this as reference
// UPDATE: trying '/studio/new' to land directly on a new project instead of the list
export default function Home() {
  // Redirecting to studio for now; swap to '/dashboard' once I build that out
  redirect('/studio');
}
