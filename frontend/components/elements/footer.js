import PropTypes from "prop-types";
import { linkPropTypes, mediaPropTypes } from "utils/types";
import NextImage from "./image";
import CustomLink from "./custom-link";

const Footer = ({ footer }) => {
  return (
    <footer className="py-12 text-gray-100 bg-gray-700">
      <div className="container flex flex-col lg:flex-row lg:justify-between">
        <div>
          {footer.logo && (
            <NextImage width="120" height="33" media={footer.logo} />
          )}
        </div>
        <nav className="flex flex-row flex-wrap items-start lg:space-x-12 lg:justify-end">
          {footer.columns.map((footerColumn) => (
            <div
              key={footerColumn.id}
              className="mt-10 w-6/12 lg:mt-0 lg:w-auto"
            >
              <p className="font-bold tracking-wide uppercase">
                {footerColumn.title}
              </p>
              <ul className="flex flex-col mt-2">
                {footerColumn.links.map((link) => (
                  <li key={link.id} className="">
                    <CustomLink
                      link={link}
                      className="block py-3 transition-opacity md:py-1 hover:opacity-70"
                    >
                      {link.text}
                    </CustomLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      {/* <div className="py-6 text-sm bg-gray-800">
        <div className="container">{footer.smallText}</div>
      </div> */}
    </footer>
  );
};

Footer.propTypes = {
  footer: PropTypes.shape({
    logo: mediaPropTypes.isRequired,
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        links: PropTypes.arrayOf(linkPropTypes),
      })
    ),
    smallText: PropTypes.string.isRequired,
  }),
};

export default Footer;
