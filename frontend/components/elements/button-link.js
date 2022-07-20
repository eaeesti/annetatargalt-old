import classNames from "classnames";
import PropTypes from "prop-types";
import { buttonLinkPropTypes } from "utils/types";
import CustomLink from "./custom-link";

const ButtonContent = ({ button, appearance, compact }) => {
  return (
    <div
      className={classNames(
        // Common classes
        "block w-full lg:w-auto text-center uppercase tracking-wide font-semibold text-base md:text-sm border rounded-md transition-colors",
        // Full-size button
        {
          "px-8 py-4": compact === false,
        },
        // Compact button
        {
          "px-6 py-2": compact === true,
        },
        // Specific to when the button is fully dark
        {
          "bg-primary-600 text-white border-primary-600 hover:bg-primary-800 hover:border-primary-800":
            appearance === "dark",
        },
        // Specific to when the button is dark outlines
        {
          "text-primary-600 border-primary-600 hover:bg-primary-600 hover:border-primary-600 hover:text-white":
            appearance === "dark-outline",
        },
        // Specific to when the button is fully white
        {
          "bg-white text-primary-800 border-white hover:bg-gray-300 hover:border-gray-300":
            appearance === "white",
        },
        // Specific to when the button is white outlines
        {
          "text-white border-white hover:bg-white hover:text-primary-800":
            appearance === "white-outline",
        }
      )}
    >
      {button.text}
    </div>
  );
};

const ButtonLink = ({ button, appearance, onClick, compact = false }) => {
  return (
    <CustomLink link={button} onClick={onClick}>
      <ButtonContent
        button={button}
        appearance={appearance}
        compact={compact}
      />
    </CustomLink>
  );
};

ButtonLink.propTypes = {
  button: buttonLinkPropTypes,
  appearance: PropTypes.oneOf([
    "dark",
    "white-outline",
    "white",
    "dark-outline",
  ]),
  compact: PropTypes.bool,
};

export default ButtonLink;
