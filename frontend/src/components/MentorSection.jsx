import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const mentors = [
  {
    name: "Shantanu Bajpai",
    role: "Co-Founder @Creating-Dimension",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
    description: "Shantanu Bajpai completed his schooling at Lucknow Public School, pursued his graduation from the University of Delhi, and earned his post-graduation from C.C.S. University.\nWith a strong academic background and a passion for education, Shantanu specializes in strategic planning, leadership, and skill development. His expertise lies in curriculum design, student mentorship, and he is dedicated to cultivating a responsive and innovative educational ecosystem.Committed to empowering learners, he continuously works towards creating impactful educational experiences.",
  },
  {
    name: "Sakshi Sanskar",
    role: "Founder @CreatingDimensions",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    description: "Sakshi Sanskar holds a postgraduate degree from the Delhi School of Economics, a graduate degree from the University of Delhi, and completed her schooling at Banasthali University.\nWith extensive experience in the education sector, Sakshi specializes in curriculum development, educational leadership, and student engagement.Her expertise lies in creating dynamic learning environments that encourage critical thinking and creativity.Passionate about transformative education, she is dedicated to equipping students with the skills and knowledge necessary for academic and professional success."
  }
];

export function MentorSection() {
  const [currentMentor, setCurrentMentor] = useState(0);

  const nextMentor = () => {
    setCurrentMentor((prev) => (prev + 1) % mentors.length);
  };

  const prevMentor = () => {
    setCurrentMentor((prev) => (prev - 1 + mentors.length) % mentors.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-[1400px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Meet Our Expert Mentors
        </h2>
        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center">
            <button
              onClick={prevMentor}
              className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>

            <div className="w-full px-4 md:px-12">
              <div key={currentMentor} className="bg-white p-4 md:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col items-center md:flex-row md:items-start gap-6 md:gap-8">
                  <div className="relative w-32 h-32 md:w-64 md:h-64 flex-shrink-0">
                    <div className="absolute inset-0 bg-blue-100 rounded-full"></div>
                    <img
                      src={mentors[currentMentor].image}
                      alt={mentors[currentMentor].name}
                      className="absolute inset-0 w-full h-full object-cover rounded-full border-4 border-white"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {mentors[currentMentor].name}
                    </h3>
                    <p className="text-base md:text-lg text-blue-600 mb-4">
                      {mentors[currentMentor].role}
                    </p>
                    <p className="text-sm md:text-lg text-gray-600 leading-relaxed">
                      {mentors[currentMentor].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={nextMentor}
              className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}