import { useRouter } from "next/router";
import EstonianHero from "@/components/sections/estonian-hero";
import LargeVideo from "@/components/sections/large-video";
import FeatureColumnsGroup from "@/components/sections/feature-columns-group";
import FeatureRowsGroup from "@/components/sections/feature-rows-group";
import BottomActions from "@/components/sections/bottom-actions";
import RichText from "./sections/rich-text";
import FunFact from "./sections/fun-fact";
import Endorsements from "./sections/endorsements";
import Information from "./sections/information";
import Header from "./sections/header";
import DisclosureGroup from "./sections/disclosure-group";
import ThankYouHeader from "./sections/thank-you-header";
import Progress from "./sections/progress";
import ProgressResults from "./sections/progress-results";
import DonationCounter from "./sections/donation-counter";
import Organizations from "./sections/organizations";
import ContactSection from "./sections/contact_section";

// Map Strapi sections to section components
const sectionComponents = {
  "sections.estonian-hero": EstonianHero,
  "sections.large-video": LargeVideo,
  "sections.feature-columns-group": FeatureColumnsGroup,
  "sections.feature-rows-group": FeatureRowsGroup,
  "sections.bottom-actions": BottomActions,
  "sections.rich-text": RichText,
  "sections.fun-fact": FunFact,
  "sections.endorsements": Endorsements,
  "sections.information": Information,
  "sections.header": Header,
  "sections.disclosure-group": DisclosureGroup,
  "sections.thank-you-header": ThankYouHeader,
  "sections.progress": Progress,
  "sections.progress-results": ProgressResults,
  "sections.donation-counter": DonationCounter,
  "sections.organizations": Organizations,
  "sections.contact-section": ContactSection,
};

// Display a section individually
const Section = ({ sectionData }) => {
  // Prepare the component
  const SectionComponent = sectionComponents[sectionData.__component];

  if (!SectionComponent) {
    return null;
  }

  // Display the section
  return <SectionComponent data={sectionData} />;
};

const PreviewModeBanner = () => {
  const router = useRouter();
  const exitURL = `/api/exit-preview?redirect=${encodeURIComponent(
    router.asPath
  )}`;

  return (
    <div className="py-4 font-semibold tracking-wide text-red-100 uppercase bg-red-600">
      <div className="container">
        Preview mode is on.{" "}
        <a
          className="underline"
          href={`/api/exit-preview?redirect=${router.asPath}`}
        >
          Turn off
        </a>
      </div>
    </div>
  );
};

// Display the list of sections
const Sections = ({ sections, preview }) => {
  return (
    <div className="flex flex-col flex-grow">
      {/* Show a banner if preview mode is on */}
      {preview && <PreviewModeBanner />}
      {/* Show the actual sections */}
      {sections.map((section) => (
        <Section
          sectionData={section}
          key={`${section.__component}${section.id}`}
        />
      ))}
    </div>
  );
};

export default Sections;
