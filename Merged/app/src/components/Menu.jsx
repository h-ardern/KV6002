import { Link } from "react-router-dom";
/**
 *
 * @author Patrick Shaw
 * @author Odera Anakpe
 * @author Joshua Marfleet
 */
function Menu() {
  return (
    <>
      <nav className="bg-gray-900 text-white p-5 shadow-lg">
        <ul className="flex justify-center space-x-8 md:space-x-12">
          <li className="group">
            <Link
              to="/"
              className="no-underline px-4 py-3 block font-medium text-sm md:text-base text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition ease-in-out duration-150"
            >
              Home
            </Link>
          </li>
          <li className="group">
            <Link
              to="/search"
              className="no-underline px-4 py-3 block font-medium text-sm md:text-base text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition ease-in-out duration-150"
            >
              Search
            </Link>
          </li>
          <li className="hover:bg-gray-700 rounded-md transition-colors duration-200">
            <Link to="/studies" className="no-underline px-3 py-2 block">Studies</Link>
          </li>
          <li className="hover:bg-gray-700 rounded-md transition-colors duration-200">
            <Link to="/upload" className="no-underline px-3 py-2 block">Upload Study</Link>
          </li>
          <li className="hover:bg-gray-700 rounded-md transition-colors duration-200">
            <Link to="/dashboard" className="no-underline px-3 py-2 block">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Menu;
