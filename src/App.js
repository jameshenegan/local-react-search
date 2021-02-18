import { useState, useEffect, useRef } from "react";
import { Checkbox, Row, Col, Container } from "react-materialize";
import QueryBuilder from "./QueryBuilder";
import SearchResults from "./SearchResults";
import getAllSearchResults from "./getAllSearchResults";

function App() {
  const numberOfResultsPerPage = 5;

  const [searchString, setSearchString] = useState("");
  const [checkBox1Value, setCheckBox1Value] = useState(false);
  const [checkBox2Value, setCheckBox2Value] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allSearchResults, setAllSearchResults] = useState([]);

  const [indices, setIndices] = useState({
    start: 1,
    end: numberOfResultsPerPage,
  });

  const [searchResultsInView, setSearchResultsInView] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(1);

  const handleSearchChange = (event) => {
    setSearchString(event.target.value);
  };

  const handleCheckBox1Change = (event) => {
    setCheckBox1Value(event.target.checked);
  };

  const handleCheckBox2Change = (event) => {
    setCheckBox2Value(event.target.checked);
  };

  const handleNextClick = () => {
    console.log({ pageNumber, numPages });
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrevClick = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  // Compute indices of allSearchResults that
  // will be used to make searchResultsInView

  const computeIndices = (pageNumber, numberOfResultsPerPage) => {
    const indexStart = (pageNumber - 1) * numberOfResultsPerPage;
    const indexEnd = pageNumber * numberOfResultsPerPage;
    return { indexStart, indexEnd };
  };

  const handleChangeToPageOne = () => {
    const indexStart = allSearchResults.length > 0 ? 1 : 0;
    const indexEnd = Math.min(numberOfResultsPerPage, allSearchResults.length);
    const newIndices = { start: indexStart, end: indexEnd };

    setIndices(newIndices);
  };

  // Update the Search Query when the search box or a check box changes
  useEffect(() => {
    // translate the checkboxes to the values that appear in the search query
    const filters = {
      form: checkBox1Value,
      derived: checkBox2Value,
    };

    console.log({ action: 0 });

    const qb = new QueryBuilder(searchString, filters);
    const currentSearchQuery = qb.buildQuery();
    setSearchQuery(currentSearchQuery);
  }, [searchString, checkBox1Value, checkBox2Value]);

  // Initial Setup

  useEffect(() => {
    const allResults = getAllSearchResults("");
    console.log({ action: 1, allResults });
    setAllSearchResults(allResults);
  }, []);

  const computeNumPages = (totalNumResults, numResultsPerPage) => {
    return Math.ceil(totalNumResults / numResultsPerPage);
  };

  // Update the search results when the search query changes
  useEffect(() => {
    const allResults = getAllSearchResults(searchQuery);
    setAllSearchResults(allResults);
  }, [searchQuery]);

  // Update the page number when the search results change
  useEffect(() => {
    console.log({ action: 2 });
    const numPages = computeNumPages(
      allSearchResults.length,
      numberOfResultsPerPage
    );

    setNumPages(numPages);
    if (pageNumber !== 1) {
      setPageNumber(1);
    }
  }, [allSearchResults]);

  // Update indices when the page number changes

  useEffect(() => {
    console.log({ action: 3 });
    // If we are on Page 1, then we may be in a situation where
    // there aren't any search results.  This requires some care.
    if (pageNumber === 1) {
      handleChangeToPageOne();
    } else {
      const { indexStart, indexEnd } = computeIndices(
        pageNumber,
        numberOfResultsPerPage
      );

      setIndices({ start: indexStart, end: indexEnd });
    }
  }, [pageNumber, allSearchResults]);

  // Update the search results in the view when the indices change
  useEffect(() => {
    console.log({ action: 4 });
    const resultsInView = allSearchResults.slice(indices.start, indices.end);
    setSearchResultsInView(resultsInView);
  }, [indices]);

  return (
    <Container>
      <Row>
        <h3>Metadata Explorer</h3>
      </Row>

      <Row>
        <input
          type="text"
          placeholder="Input search query here..."
          onInput={handleSearchChange}
        />
      </Row>
      <Row>
        <Col>Checkboxes:</Col>
        <Col>
          <Checkbox
            id="CheckBox1"
            label="Form"
            onInput={handleCheckBox1Change}
          />
        </Col>
        <Col>
          {" "}
          <Checkbox
            id="CheckBox2"
            label="Derived"
            onInput={handleCheckBox2Change}
          />
        </Col>
      </Row>

      <Row>
        <code>GET http://my.api/resources/{searchQuery}</code>
      </Row>

      <Row>
        <ul className="pagination">
          <li className="waves-effect">
            <a href="#!" onClick={() => handlePrevClick()}>
              <i className="material-icons">chevron_left</i>
            </a>
          </li>
          <li className="active">
            <a href="#!"> {pageNumber}</a>
          </li>
          <li className="waves-effect">
            <a href="#!" onClick={() => handleNextClick()}>
              <i className="material-icons">chevron_right</i>
            </a>
          </li>
        </ul>
      </Row>
      <Row>
        <SearchResults
          dataToView={searchResultsInView}
          numTotal={allSearchResults.length}
          numPages={numPages}
          pageNumber={pageNumber}
          indices={indices}
        ></SearchResults>
      </Row>
    </Container>
  );
}

export default App;
