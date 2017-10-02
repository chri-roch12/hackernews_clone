import React, { Component } from 'react';
import './App.css';

/* API request broken down to url constants and default parameters for
url composition flexibilty in the future
*/
const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

      //High order function example, ES5
/*
function isSearched(searchTerm) {
  return function(item) {
    return !searchTerm ||
    item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
*/

    //Same functionality as above, via ES6
const isSearched = (searchTerm) => (item) =>
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

/*
search Component, note that => removes need for
return block body. Something COULD be done prior to
the return.
*/
const Search = ({ value, onChange, children }) =>

  <form>
    { children }<input
      type="text"
      value={value}
      onChange={onChange}
    />
  </form>

//table Component

const Table = ({ list, pattern, onDismiss }) =>

  <div className="table">
    { list.filter(isSearched(pattern)).map(item =>
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

//button Component

const Button = ({ onClick, className='', children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>


class App extends Component {
    //Add state(s), ES6 Object initializer shorthand
  constructor(props) {
    super(props);

    this.state = {
      default: null,
      searchTerm: DEFAULT_QUERY,
    };

    //Bind setSearchTopstories() method to Component constructor
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    //Bind fetchSeachTopstories() method to Component constructor
    this.fetchSeachTopstories = this.fetchSeachTopstories.bind(this);
    //Bind onDismiss() method to Component constructor
    this.onDismiss = this.onDismiss.bind(this);
    //Bind OnSearchChange() method to Component constructor
    this.onSearchChange = this.onSearchChange.bind(this);
  }

    //Define the setSearchTopstories() action for constructor.
  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSeachTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSeachTopstories(searchTerm);
  }


    //Define the onDismiss() action for constructor.
  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }

    //Define the onSearchChange() for constructor
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

    //Render() method from react library for Component
  render() {

    const { searchTerm, list } = this.state;
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}>Search
          </Search>
          <Table
            list={list}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        </div>
      </div>
    );
  }
}

export default App;
