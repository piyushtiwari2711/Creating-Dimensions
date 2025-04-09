import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
export function Hero() {
  const { user } = useAuth();
  return (
    <section
      id="hero-section"
      className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50"
    >
      <div className="container max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="flex items-center space-x-2 mb-6">
              <span className="px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                #1 Learning Platform
              </span>
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Enhance your skills and achieve excellence
              <span className="text-blue-600"> with our esteemed institution.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join thousands of successful students who have transformed their
              learning journey with our expertly curated study materials and
              personalized guidance.
            </p>
            <div className="space-y-6">
              <div className="flex space-x-4">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition flex items-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">
                    Access to 100+ premium study materials
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">
                    Personal mentorship from industry experts
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-600">
                    Interactive learning community
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-6 transform opacity-10"></div>
            <div className="absolute inset-0 bg-blue-600 rounded-3xl -rotate-6 transform opacity-10"></div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                alt="Students studying"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
