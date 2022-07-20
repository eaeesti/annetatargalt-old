import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";

import Cookies from "js-cookie";

import { useOnClickOutside } from "../utils/hooks";

const LocaleSwitch = ({ pageContext }) => {
  const isMounted = useRef(false);
  const select = useRef();
  const router = useRouter();
  const [locale, setLocale] = useState();
  const [showing, setShowing] = useState(false);

  const handleLocaleChange = async (selectedLocale) => {
    // Persist the user's language preference
    // https://nextjs.org/docs/advanced-features/i18n-routing#leveraging-the-next_locale-cookie
    Cookies.set("NEXT_LOCALE", selectedLocale);
    setLocale(selectedLocale);
  };

  const handleLocaleChangeRef = useRef(handleLocaleChange);
  useOnClickOutside(select, () => setShowing(false));

  useEffect(() => {
    const localeCookie = Cookies.get("NEXT_LOCALE");
    if (!localeCookie) {
      handleLocaleChangeRef.current(router.locale);
    }

    const checkLocaleMismatch = async () => {
      if (
        !isMounted.current &&
        localeCookie &&
        localeCookie !== pageContext.locale
      ) {
        // Redirect to locale page if locale mismatch
        const localePage = getLocalizedPage(localeCookie, pageContext);

        router.push(
          `${localizePath({ ...pageContext, ...localePage })}`,
          `${localizePath({ ...pageContext, ...localePage })}`,
          { locale: localePage.locale }
        );
      }
      setShowing(false);
    };

    setLocale(localeCookie || router.locale);
    checkLocaleMismatch();

    return () => {
      isMounted.current = true;
    };
  }, [locale, router, pageContext]);

  return (
    <div ref={select} className="relative lg:mr-4">
      <button
        type="button"
        className="flex justify-between items-center p-2 space-x-2 h-full rounded-md cursor-pointer lg:px-4 lg:py-2 hover:opacity-70"
        onClick={() => setShowing(!showing)}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <span className="lowercase">{locale}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`whitespace-nowrap right-0 bg-white text-primary-800 p-1 mt-1 shadow-lg rounded-md ${
          showing ? "absolute" : "hidden"
        }`}
      >
        {pageContext.localizedPaths &&
          pageContext.localizedPaths.map(({ href, locale, language }) => {
            return (
              <Link
                href={href}
                key={locale}
                locale={locale}
                role="option"
                passHref
              >
                <p
                  onClick={() => handleLocaleChange(locale)}
                  className="px-5 py-3 text-center lowercase rounded-md cursor-pointer hover:bg-gray-100"
                >
                  {language}
                </p>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

LocaleSwitch.propTypes = {
  initialLocale: PropTypes.string,
};

export default LocaleSwitch;
