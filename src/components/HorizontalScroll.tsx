"use client";

import HomePage from "./HomeSlide";

function HorizontalScroll() {
  return (
    <div className="flex w-full h-full">
      {/* this section is for the scrolling and navigation of all slides */}
      <section className="w-1/4 bg-gradient-to-r from-[#6A0DAD] to-[#EDEDED]">
        <ul>
          <li>Home</li>
          <li>Blogs</li>
          <li>Projects</li>
          <li>Skills</li>
        </ul>
      </section>
      <section className="w-full overflow-x-auto flex space-x-5 justify-start items-center px-10" style={{scrollbarWidth: "none"}}>
        {[
          <HomePage key="home-page" />,
          "This is the section",
          "This is the section",
          "This is the section",
          "This is the section",
        ].map((content, index, arr) => (
          <div
            key={index}
            className={`min-w-3/4 h-full flex items-center justify-end  ${
              `${index === arr.length - 1 ? "mr-36" : ""} ${index === 0 ? "ml-10" : ""}` // Extra margin for last and first slides
            }`}
          >
            <div className="w-4xl h-10/12 bg-red-500 flex items-center justify-center">
              {content}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default HorizontalScroll;
