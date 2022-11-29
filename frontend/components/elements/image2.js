import { getStrapiMedia } from "utils/media";
import Image from "next/image";
import PropTypes from "prop-types";
import { mediaPropTypes } from "utils/types";

const NextImage2 = ({ media, ...props }) => {
  const { url, alternativeText } = media;

  const loader = ({ src }) => {
    return getStrapiMedia(src);
  };

  // The image is responsive
  return (
    <Image
      loader={loader}
      layout="fill"
      src={url}
      alt={alternativeText || ""}
      {...props}
    />
  );
};

NextImage2.propTypes = {
  media: mediaPropTypes.isRequired,
  className: PropTypes.string,
};

export default NextImage2;
