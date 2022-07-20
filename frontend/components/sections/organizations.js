import React from "react";
import FeatureRowsGroup from "./feature-rows-group";

const Organizations = ({ data }) => {
  const features = data.organizations.map((organization) => ({
    id: organization.id,
    media: organization.media,
    title: organization.name,
    description: organization.description,
  }));
  return <FeatureRowsGroup data={{ features }} />;
};

export default Organizations;
