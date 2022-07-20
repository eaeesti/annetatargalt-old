import PropTypes from "prop-types";
import Endorsement from "../elements/endorsement";

const Endorsements = ({ data }) => {
  return (
    <div className="bg-gray-100">
      <div className="container flex flex-col py-32 space-y-16">
        <h2 className="text-4xl font-bold text-center text-primary-700">
          {data.title}
        </h2>
        <div className="grid grid-cols-1 gap-8 justify-center justify-items-center items-center mx-auto w-auto sm:grid-cols-2 xl:grid-cols-4">
          {data.endorsements.map((endorsement, index) => (
            <Endorsement key={`endorsement${index}`} data={endorsement} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Endorsements;
