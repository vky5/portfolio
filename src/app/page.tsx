import HorizontalScroll from "@/components/HorizontalScroll";

function Page() {
  return (
    <div className="bg-background h-screen flex justify-center items-center">
      <div className="w-full h-full border">
        <HorizontalScroll />
      </div>
    </div>
  );
}

export default Page;