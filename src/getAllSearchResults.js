import QueryParser from "./QueryParser";
import data from "./targetVariables.json";

function getAllSearchResults(searchQuery) {
  const qp = new QueryParser(searchQuery);

  const filters = qp.filters;
  const keywords = qp.keywords;

  let filteredData = [];

  if (filters.length > 0) {
    filteredData = data.filter((datum) =>
      filters.includes(datum.source.toLowerCase())
    );
  } else {
    filteredData = data;
  }
  for (const keyword of keywords) {
    filteredData = filteredData.filter(
      (datum) =>
        datum.label.toLowerCase().includes(keyword) ||
        datum.sheet.toLowerCase().includes(keyword) ||
        datum.source.toLowerCase().includes(keyword) ||
        datum.name.toLowerCase().includes(keyword)
    );
  }
  return filteredData;
}

export default getAllSearchResults;
