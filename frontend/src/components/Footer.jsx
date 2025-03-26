import { BookOpen, Send } from 'lucide-react';
import {Link as ScrollLink} from 'react-scroll';
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container max-w-[1400px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <BookOpen className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold">Creating Dimensions</span>
            </div>
            <p className="text-gray-400">
              Empowering students with premium study materials and expert guidance.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><ScrollLink to='hero-section' duration = {500}  smooth={true} className="text-gray-400 hover:text-white cursor-pointer">Home</ScrollLink></li>
              <li><ScrollLink to='mentor-section' duration = {500}  smooth={true} className="text-gray-400 hover:text-white cursor-pointer">Mentors</ScrollLink></li>
              <li><ScrollLink to='contact-section' duration = {500}  smooth={true} className="text-gray-400 hover:text-white cursor-pointer">Contact</ScrollLink></li>
              {/* <li><a href="#" className="text-gray-400 hover:text-white">Mentors</a></li> */}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to get updates on new notes and features.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-2 rounded-l-lg w-full focus:outline-none text-gray-900"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 Creating Dimension. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}