import EXAMPLE_IMPACT_DATA from "../data/example_impact_data.json";

const baseURL = "https://impact.gieffektivt.no/api";

export const fetchEvaluations = async () => {
  if (process.env.NODE_ENV === "development") {
    return EXAMPLE_IMPACT_DATA.evaluations;
  }

  const requestURL = `${baseURL}/evaluations?currency=EUR&language=et`;
  const response = await fetch(requestURL);
  const data = await response.json();
  return data.evaluations;
};

export const latestEvaluations = (evaluations) => {
  return evaluations.filter((evaluation1) => {
    const foundLaterEvaluation = evaluations.find((evaluation2) => {
      return (
        hasSameCharity(evaluation1, evaluation2) &&
        isLaterEvaluation(evaluation2, evaluation1)
      );
    });
    return !foundLaterEvaluation;
  });
};

export const latestOutputCostsByCharity = (evaluations) => {
  return Object.fromEntries(
    latestEvaluations(evaluations).map((evaluation) => [
      evaluation.charity.abbreviation,
      evaluation.converted_cost_per_output,
    ])
  );
};

export const outputsPerDonation = (evaluations, charity, donation) => {
  const outputCost = latestOutputCostsByCharity(evaluations)[charity];
  return donation / outputCost;
};

const hasSameCharity = (evaluation1, evaluation2) => {
  return evaluation2.charity.id === evaluation1.charity.id;
};

const isLaterEvaluation = (evaluation1, evaluation2) => {
  const yearIsLater = evaluation1.start_year > evaluation2.start_year;
  const yearIsSame = evaluation1.start_year === evaluation2.start_year;
  const monthIsLater = evaluation1.start_month > evaluation2.start_month;
  return yearIsLater || (yearIsSame && monthIsLater);
};
