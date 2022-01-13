import logo from './logo.svg';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {    
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  }
]


function App() {
  return (
    <div className="App">
      <h1>My Hacker Stories</h1>
      
      <Search />

      <hr />

      <List />
    </div>
  );
}

function Search() {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  )
}

function List() {
  return (
    <ul style={{color: 'purple', display: 'flex', flexDirection:'column', width:'400px', margin:'0 auto'}}>
      {list.map((item) => {
        return(
          <li key={item.objectID} style={{paddingBottom: '12px', listStyle: 'inside square', display:'grid', gridTemplateColumns:'1fr 3fr 1fr 1fr', columnGap:'18px'}}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
          </li>
        )
      })}
    </ul>
  )
}
export default App;
