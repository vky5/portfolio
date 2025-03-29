import { useState } from "react";

function Sidebar({
  scrollToSlide,
}: {
  scrollToSlide: (slide: string) => void;
}) {
  const [activeSlide, setActiveSlide] = useState("home");

  const handleNavigation = (slide: string) => {
    setActiveSlide(slide); // Set the active slide
    scrollToSlide(slide); // Scroll to the selected slide
  };

  return (
    <section className="w-1/4 h-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] flex flex-col justify-center items-center shadow-lg">
      {/* Logo or Header */}
      <div className="w-full py-5 text-center text-white text-2xl font-bold tracking-wide border-b border-white">
        Vaibhav Yadav
        <div className="text-xl">vaibhavk05@proton.me</div>
      </div>

      {/* Navigation Section */}
      <ul className="w-full flex flex-col items-center space-y-8 mt-10">
        {[
          { id: "home", label: "Home" },
          { id: "blogs", label: "Blogs" },
          { id: "projects", label: "Projects" },
          { id: "skills", label: "Skills" },
        ].map((item) => (
          <li
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={`cursor-pointer w-3/4 text-center py-4 rounded-full transition-all duration-300 transform ${
              activeSlide === item.id
                ? "bg-white text-[#1E3A8A] scale-110 shadow-xl"
                : "bg-[#3B82F6] text-white hover:bg-white hover:text-[#1E3A8A] hover:scale-105"
            }`}
          >
            - {item.label}
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-auto py-5 text-center text-white text-sm">
        © 2025 My Portfolio
      </div>
    </section>
  );
}

export default Sidebar;
