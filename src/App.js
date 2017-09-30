import React, { Component } from 'react';
import './App.css';

//test data for App Component
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Fake',
    url: 'https://news.ycombinator.com/',
    author: 'et al.',
    num_comments: 5,
    points: 4,
    objectID: 2,
  },
];


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
      list,
      searchTerm: '',
    };

    //Bind onDismiss() method to Component constructor
    this.onDismiss = this.onDismiss.bind(this);

    //Bind OnSearchChange() method to Component constructor
    this.onSearchChange = this.onSearchChange.bind(this);
  }
    //Shoehorn the onDismiss() action into constructor.
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
