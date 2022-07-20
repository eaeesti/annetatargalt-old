import PropTypes from "prop-types";
import { MdClose, MdChevronRight } from "react-icons/md";
import {
  mediaPropTypes,
  linkPropTypes,
  buttonLinkPropTypes,
} from "utils/types";
import { useLockBodyScroll } from "utils/hooks";
import { getButtonAppearance } from "utils/button";
import ButtonLink from "./button-link";
import NextImage from "./image";
import CustomLink from "./custom-link";
import Link from "next/link";

const MobileNavMenu = ({ navbar, closeSelf }) => {
  // Prevent window scroll while mobile nav menu is open
  useLockBodyScroll();

  return (
    <div className="fixed top-0 left-0 z-40 w-screen h-screen bg-white">
      <div className="container overflow-y-auto h-full">
        <div className="flex flex-col justify-end pt-20 pb-6 mx-auto sm:w-9/12">
          <ul className="flex flex-col items-baseline mb-10 space-y-4 text-xl list-none">
            {navbar.links.map((navLink) => (
              <li key={navLink.id} className="block w-full margin-auto">
                <CustomLink link={navLink} onClick={closeSelf}>
                  <div className="flex flex-row justify-between items-center p-4 rounded-lg border border-gray-200 transition-all hover:bg-gray-100">
                    <span>{navLink.text}</span>
                    <MdChevronRight className="w-auto h-8" />
                  </div>
                </CustomLink>
              </li>
            ))}
          </ul>
          <ButtonLink
            button={navbar.button}
            onClick={closeSelf}
            appearance={getButtonAppearance(navbar.button.type, "light")}
          />
        </div>
      </div>
    </div>
  );
};

MobileNavMenu.propTypes = {
  navbar: PropTypes.shape({
    logo: mediaPropTypes,
    links: PropTypes.arrayOf(linkPropTypes),
    button: buttonLinkPropTypes,
  }),
  closeSelf: PropTypes.func,
};

export default MobileNavMenu;
