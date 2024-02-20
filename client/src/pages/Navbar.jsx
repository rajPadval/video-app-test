const Navbar = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center text-white text-md lg:text-xl w-full bg-black px-8 py-5">
      <img src="/tribesflix.png" alt="YouTube Logo" className="" />
      <div className="flex gap-6 px-5">
        <li className="list-none font-sans hover:text-green-500 hover:scale-125 transiton-all duration-500 ease-in-out cursor-pointer">
          Home
        </li>
        <li className="list-none font-sans hover:text-green-500 hover:scale-125 transiton-all duration-500 ease-in-out cursor-pointer">
          Movies
        </li>
        <li className="list-none font-sans hover:text-green-500 hover:scale-125 transiton-all duration-500 ease-in-out cursor-pointer">
          Series
        </li>
        <li className="list-none font-sans hover:text-green-500 hover:scale-125 transiton-all duration-500 ease-in-out cursor-pointer">
          Sports
        </li>
        <li className="list-none font-sans hover:text-green-500 hover:scale-125 transiton-all duration-500 ease-in-out cursor-pointer">
          Pricing
        </li>
      </div>
    </div>
  );
};

export default Navbar;
