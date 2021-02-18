import { Divider, Section } from "react-materialize";

function SearchResults(props) {
  const { dataToView, numTotal, pageNumber, numPages, indices } = props;
  console.log(indices);
  return (
    <div>
      <p>
        Showing results {indices.start} to {indices.end} of {numTotal} total
        results. On page {Math.min(pageNumber, numPages)} of {numPages}.
      </p>
      {dataToView.map((datum, i) => (
        <div key={i}>
          <Divider></Divider>
          <Section>
            <h4>{datum.name}</h4>
            <ul>
              <li>
                <b>Sheet</b>: {datum.sheet}
              </li>
              <li>
                <b>Name</b>: {datum.name}
              </li>
              <li>
                <b>Label</b>: {datum.label}
              </li>
              <li>
                <b>Source</b>: {datum.source}
              </li>
            </ul>
          </Section>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
