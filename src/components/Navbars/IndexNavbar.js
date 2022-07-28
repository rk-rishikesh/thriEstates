/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              BrandVilla
            </Link>
          </div>

          <div className="mt-2 flex flex-col lg:flex-row list-none lg:ml-auto">
            <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
              <Link
                className="text-black text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
                to="/profile"
              >
                Metaverse Section
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
