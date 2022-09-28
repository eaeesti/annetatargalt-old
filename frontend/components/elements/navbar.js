import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import { Transition } from "@headlessui/react";

import { getButtonAppearance } from "utils/button";
import {
  mediaPropTypes,
  linkPropTypes,
  buttonLinkPropTypes,
} from "utils/types";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MobileNavMenu from "./mobile-nav-menu";
import ButtonLink from "./button-link";
import NextImage from "./image";
import CustomLink from "./custom-link";
import LocaleSwitch from "../locale-switch";

const Navbar = ({ navbar, pageContext }) => {
  const router = useRouter();
  const [mobileMenuIsShown, setMobileMenuIsShown] = useState(false);
  // const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const logo = document.getElementById("logo");

    function calculateNavbarBackground() {
      if (window.scrollY > 0 || mobileMenuIsShown) {
        addNavbarBackground();
        // logo.classList.remove("scale-125");
      } else {
        removeNavbarBackground();
        // logo.classList.add("scale-125");
      }
      // setScrolledDown(window.scrollY > 1);
    }

    function addNavbarBackground() {
      navbar.classList.add("shadow-xl");
      navbar.classList.add("bg-primary-700");
      navbar.classList.remove("sm:pt-8");
    }

    function removeNavbarBackground() {
      navbar.classList.remove("shadow-xl");
      navbar.classList.remove("bg-primary-700");
      navbar.classList.add("sm:pt-8");
    }

    calculateNavbarBackground();
    document.addEventListener("scroll", calculateNavbarBackground);
    // window.scrollTo(0, 0);
  });

  return (
    <>
      {/* The actual navbar */}
      <nav
        id="navbar"
        className="fixed z-50 w-full text-white transition-all sm:pt-8"
      >
        <div className="container flex flex-row justify-between items-center">
          {/* Content aligned to the left */}
          <div className="flex flex-row items-center">
            <Link href="/">
              <a
                id="logo"
                className="w-32 h-8 transition-all hover:opacity-60"
                onClick={() => setMobileMenuIsShown(false)}
              >
                <span className="sr-only">Logo home button</span>
                <NextImage
                  width="120"
                  height="33"
                  media={navbar.logo}
                  unoptimized
                />
              </a>
            </Link>
            {/* List of links on desktop */}
            <ul className="hidden flex-row items-center ml-10 list-none lg:flex">
              {navbar.links.map((navLink) => (
                <li key={navLink.id}>
                  <CustomLink link={navLink} locale={router.locale}>
                    <div className="px-4 py-6 text-center transition-opacity hover:opacity-70">
                      {navLink.text}
                    </div>
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center">
            {/* Locale Switch Mobile */}
            {pageContext.localizedPaths.length > 1 && (
              <div className="lg:hidden">
                <LocaleSwitch pageContext={pageContext} />
              </div>
            )}
            {/* Hamburger menu on mobile */}
            {!mobileMenuIsShown && (
              <button
                onClick={() => setMobileMenuIsShown(true)}
                className="block p-4 transition-opacity hover:opacity-70 lg:hidden"
                aria-label="Menu button"
              >
                <Bars3Icon className="w-8 h-8 text-white"></Bars3Icon>
              </button>
            )}
            {/* Close button when menu is open */}
            {mobileMenuIsShown && (
              <button
                onClick={() => setMobileMenuIsShown(false)}
                className="block p-4 transition-opacity hover:opacity-60 lg:hidden"
                aria-label="Close menu button"
              >
                <XMarkIcon className="w-8 h-8 text-white"></XMarkIcon>
              </button>
            )}
            {/* Locale Switch Desktop */}
            {pageContext.localizedPaths.length > 1 && (
              <div className="hidden lg:block">
                <LocaleSwitch pageContext={pageContext} />
              </div>
            )}
            {/* CTA button on desktop */}
            {navbar.button && (
              <div className="hidden lg:block">
                <ButtonLink
                  button={navbar.button}
                  appearance={getButtonAppearance(navbar.button.type, "dark")}
                  compact
                />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile navigation menu panel */}
      <Transition
        show={mobileMenuIsShown}
        enter="transition-all duration-200 ease-in z-40 fixed"
        enterFrom="transform scale-y-0 opacity-0"
        enterTo="transform scale-y-100 opacity-100"
        leave="transition-all duration-200 ease-out z-40 fixed"
        leaveFrom="transform scale-y-100 opacity-100"
        leaveTo="transform scale-y-0 opacity-0"
      >
        <MobileNavMenu
          navbar={navbar}
          closeSelf={() => setMobileMenuIsShown(false)}
        />
      </Transition>
    </>
  );
};

Navbar.propTypes = {
  navbar: PropTypes.shape({
    logo: PropTypes.shape({
      image: mediaPropTypes,
      url: PropTypes.string,
    }),
    links: PropTypes.arrayOf(linkPropTypes),
    button: buttonLinkPropTypes,
  }),
  initialLocale: PropTypes.string,
};

export default Navbar;
