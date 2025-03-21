"use client";

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

      {/* this section is going to contain all the slides */}
      {/* <section className="flex justify-center items-center w-3/4 h-full overflow-x-auto bg-green-400 space-x-3"> */}
        {/* but let's create a section which is going to be the center position of slideshow */}
        {/* <section className="min-w-[75%] h-3/4 bg-red-500">
          this is the text
        </section>
        <section className="min-w-[75%] h-3/4 bg-red-500">
          this is another text
        </section> */}  
        {/* <div className="w-3/4 h-3/4 bg-green-500 overflow-x-visible space-x-3 flex z-10">
          <section className="min-w-full h-full bg-red-500">
            this is the text
          </section>
          <section className="min-w-full h-full bg-red-500"> 
            this is another text
          </section>
        </div>
      </section> */}
      

      <section className="w-full overflow-x-auto flex space-x-5 justify-start items-center">
          <div className="min-w-3/4 h-4/5 flex items-center justify-between bg-amber-200">this is text</div>
          <div className="min-w-3/4 h-4/5 flex items-center justify-between bg-amber-200">this is text</div>
          <div className="min-w-3/4 h-4/5 flex items-center justify-between bg-amber-200">this is text</div>
          <div className="min-w-3/4 h-4/5 flex items-center justify-between bg-amber-200">this is text</div>
          <div className="min-w-3/4 h-4/5 flex items-center justify-between bg-amber-200">this is text</div>
      </section>



    </div>
  );
}

export default HorizontalScroll;
