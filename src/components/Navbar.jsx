import ufaz_logo from "../assets/ufaz_logo.png";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { navTabs } from "../constants/navbar-tabs";

const Navbar = () => {
  const [toggleNavbar, setToggleNavbar] = useState(false);

  const navRef = useRef();

  useClickOutside(navRef, () => setToggleNavbar(false));

  return (
    <nav ref={navRef} className="w-full py-4 bg-neutral-200 fixed top-0 left-0 z-50">
      <div className="container h-12 flex justify-between items-center">
        <Link to="/" className="h-full">
          <img src={ufaz_logo} alt="ufaz_logo" className="h-full" />
        </Link>

        {toggleNavbar ? (
          <BiX className="sm:hidden text-3xl cursor-pointer text-orange-500" onClick={() => setToggleNavbar(false)} />
        ) : (
          <BiMenu className="sm:hidden text-3xl cursor-pointer" onClick={() => setToggleNavbar(true)} />
        )}

        <ul
          className={`flex items-center uppercase text-sm absolute w-[150px] top-[calc(100%+2.5vw)] right-[2.5vw] ${
            toggleNavbar ? "translate-x-0" : "translate-x-[calc(100%+5vw)] sm:translate-x-0"
          } duration-300 sm:static sm:w-auto bg-neutral-200 sm:bg-transparent flex-col sm:flex-row gap-4 sm:gap-8 p-4 sm:p-0 rounded-xl sm:rounded-none`}
        >
          {navTabs.map((tab) => (
            <li key={tab.id} onClick={() => setToggleNavbar(false)}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "hover:text-orange-500 border-transparent duration-300"
                }
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
