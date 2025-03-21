import { BookOpen } from 'lucide-react';
import {Link} from 'react-router'
export function Navbar() {
  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="container max-w-[1400px] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">Creating Dimensions</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#" className="cursor-pointer text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="#" className="cursor-pointer text-gray-600 hover:text-blue-600">Mentors</Link>
            <Link href="#" className="cursor-pointer text-gray-600 hover:text-blue-600">Contact</Link>
          </div>
          <Link to="/signin" className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
