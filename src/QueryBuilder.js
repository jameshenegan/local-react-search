export default class QueryBuilder {
  constructor(inputSearchString, filters, pageNumber, numResults) {
    this.inputSearchString = inputSearchString;
    this.filters = filters;
    this.pageNumber = pageNumber;
    this.numResults = numResults;
  }

  getQueryFromSearchString() {
    let querySearchString = "";

    if (this.inputSearchString.length > 0) {
      const inputSearchList = this.inputSearchString.toLowerCase().split(" ");
      querySearchString += "keywords=";
      querySearchString += inputSearchList.join("+");
    }
    return querySearchString;
  }

  getQueryFromFilters() {
    let queryFilterString = "";
    let trues = [];

    const keys = Object.keys(this.filters);
    const filteredKeys = keys.filter((key) => this.filters[key]);

    if (filteredKeys.length > 0) {
      queryFilterString += "filters=";
      queryFilterString += filteredKeys.join("+");
    }

    return queryFilterString;
  }

  buildQuery() {
    let searchQuery = "";

    const queryFromSearchString = this.getQueryFromSearchString();
    const queryFromFilters = this.getQueryFromFilters();

    const queryItems = [];
    if (queryFromSearchString.length > 0) {
      queryItems.push(queryFromSearchString);
    }

    if (queryFromFilters.length > 0) {
      queryItems.push(queryFromFilters);
    }

    if (queryItems.length > 0) {
      searchQuery += queryItems.join("&");
    }

    return searchQuery;
  }
}
