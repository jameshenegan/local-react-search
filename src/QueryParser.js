export default class QueryParser {
  constructor(searchQuery) {
    // Split something like 'keywords=a+b&filters=c+d'
    // into something like ['keywords=a+b', 'filters=c+d']
    const splitSearchQuery = searchQuery.split("&");

    // Identify the keyword string ('keywords=a+b')
    // and the filters string ('filters=c+d')
    let keywordsString = "";
    let filtersString = "";

    for (const term of splitSearchQuery) {
      if (term.length > 0) {
        if (term.substring(0, 1) == "k") {
          keywordsString = term;
        }
        if (term.substring(0, 1) == "f") {
          filtersString = term;
        }
      }
    }

    // Go from 'keywords=a+b' to 'a+b
    if (keywordsString.length > 0) {
      keywordsString = keywordsString.split("=")[1];
    }
    // Go from 'filters=c+d' to 'c+d'
    if (filtersString.length > 0) {
      filtersString = filtersString.split("=")[1];
    }

    // Go from 'a+b' to ['a','b']
    const keywordsUnfiltered = keywordsString.split("+");
    // Go from 'c+d' to ['c','d']
    const filtersUnfiltered = filtersString.split("+");

    // Go from ['a','b',''] to ['a','b']
    const keywords = keywordsUnfiltered.filter((keyword) => keyword !== "");
    const filters = filtersUnfiltered.filter((filter) => filter !== "");

    this.keywords = keywords;
    this.filters = filters;
  }
}
