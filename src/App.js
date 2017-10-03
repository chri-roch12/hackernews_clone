import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';

/* API request broken down to url constants and default parameters for
url composition flexibilty in the future
*/
const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

/*
search Component, note that => removes need for
return block body. Something COULD be done prior to
the return.
*/
const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      { children }
    </button>
  </form>

//Search property testing

Search.PropTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired

}

//table Component

const Table = ({ list, onDismiss }) =>

  <div className="table">
    { list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={{ width: '40%' }}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={{ width: '30%' }}>
          {item.author}
        </span>
        <span style={{ width: '10%' }}>
          {item.num_comments}
        </span>
        <span style={{ width: '10%' }}>
          {item.points}
        </span>
        <span style={{ width: '10%' }}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline"
          >
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

// Table property testing

Table.PropTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
}

//button Component

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

Button.defaultProps = {
  className: '',
};

// Button property testing

Button.PropTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
}

class App extends Component {
    //Add state(s), ES6 Object initializer shorthand
  constructor(props) {
    super(props);

    this.state = {
      defaults: null,
      searchTerm: DEFAULT_QUERY,
    };

    //Bind needsToSearchTopstories() method to Component constructor
    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    //Bind setSearchTopstories() method to Component constructor
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    //Bind fetchSearchTopstories() method to Component constructor
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    //Bind onDismiss() method to Component constructor
    this.onDismiss = this.onDismiss.bind(this);
    //Bind OnSearchChange() method to Component constructor
    this.onSearchChange = this.onSearchChange.bind(this);
    // Bind onSearchSubmit() method to Component constructor
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

    // Define needsToSearchTopstories action
  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }
    //Define the setSearchTopstories() action for constructor.
  setSearchTopstories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];

    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }

    //Define the onDismiss() action for constructor.
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;

    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

    //Define the onSearchChange() for constructor
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  // Define the onSearchSubmit() for constructor
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }

    //Render() method from react library for Component
  render() {

    const {
      searchTerm,
      results,
      searchKey
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>

          <Table
            list={list}
            onDismiss={this.onDismiss}
          />

          <div className="interactions">
            <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
              More
            </Button>
          </div>

        </div>
      </div>
    );
  }
}

export default App;

export {
  Button,
  Search,
  Table,
};
