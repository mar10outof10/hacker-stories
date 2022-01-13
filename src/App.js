import logo from './logo.svg';
import './App.css';

const helloList = ['Hiya', 'Bienvenido', 'Aloha'];

function getTitle(title) {
  return title;
}
function App() {
  return (
    <div className="App">
      {helloList.map((greeting) => {
        return <h1>{greeting}, {getTitle('React')}</h1>
      })}
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
    </div>
  );
}

export default App;
