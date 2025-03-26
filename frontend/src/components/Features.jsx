import { Library, GraduationCap, Users } from "lucide-react";

export function Features() {
  return (
    <section id="feature-section" className="py-16 bg-gray-50">
      <div className="container max-w-[1400px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          What We Provide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="bg-blue-100 p-3 rounded-full w-fit mb-6">
              <Library className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Curated Notes</h3>
            <p className="text-gray-600">
              Access carefully selected and verified study materials from top
              performers.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="bg-blue-100 p-3 rounded-full w-fit mb-6">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Expert Guidance</h3>
            <p className="text-gray-600">
              Learn from experienced mentors who guide you through complex
              topics.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="bg-blue-100 p-3 rounded-full w-fit mb-6">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Community Support</h3>
            <p className="text-gray-600">
              Join a community of learners and share knowledge collaboratively.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
