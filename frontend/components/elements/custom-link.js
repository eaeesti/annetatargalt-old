import Link from "next/link";
import PropTypes from "prop-types";
import { linkPropTypes } from "utils/types";

const CustomLink = ({ link, children, className, onClick }) => {
  const isInternalLink = link.url.startsWith("/");

  // For internal links, use the Next.js Link component
  if (isInternalLink) {
    return (
      <Link href="/[[...slug]]" as={link.url}>
        <a className={className} onClick={onClick}>
          {children}
        </a>
      </Link>
    );
  }

  // Plain <a> tags for external links
  if (link.newTab) {
    return (
      <a
        className={className}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <a className={className} href={link.url} target="_self" onClick={onClick}>
      {children}
    </a>
  );
};

CustomLink.propTypes = {
  link: linkPropTypes,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default CustomLink;
