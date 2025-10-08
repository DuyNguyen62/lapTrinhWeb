
import Link from 'next/link'; // Import a special Link component from Next.js for faster navigation

// This is a React Component. It's a JavaScript function that returns HTML-like code called JSX.
export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          MyBlog
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/login" className="hover:text-gray-300">
              Login
            </Link>
          </li>
          <li>
            <Link href="/register" className="hover:text-gray-300">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

// --- KEY DIFFERENCES FROM HTML ---
// 1. `class` attribute becomes `className`. This is because `class` is a reserved word in JavaScript.
// 2. We use `<Link>` from Next.js instead of `<a>` for navigating between pages in our app. This makes page transitions faster.
// 3. The entire structure is returned from a JavaScript function.
