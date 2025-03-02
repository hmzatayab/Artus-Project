import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen  text-center px-6">
      {/* Oops Text with Galaxy Background */}
      <h1
        className="text-[200px] font-extrabold bg-clip-text text-transparent"
        style={{
          backgroundImage: "url('./Galaxy.jpg')",
          WebkitBackgroundClip: "text",
        }}
      >
        Oops!
      </h1>

      {/* 404 Message */}
      <h2 className="text-2xl font-semibold mt-4">404 - PAGE NOT FOUND</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>

      {/* Button */}
      <Link to="/" className="mt-6">
        <Button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition cursor-pointer">
          GO TO HOMEPAGE
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
