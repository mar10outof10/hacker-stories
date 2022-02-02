import './App.css';
import React, { useState, useEffect, useRef, useReducer } from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) ?? initialState
  )  

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key])

  return [value, setValue];
}  

const InputWithLabel = ({id, value, type="text", isFocused, onInputChange, children}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <div>
        <label htmlFor={id}>{children}</label>
        <input
          id={id}
          type={type}
          value={value}
          autoFocus={isFocused}
          onChange={onInputChange}
          />
      </div>
    </>
  )
}

const List = ({list, onRemoveItem}) => (
  <ul style={{ color: 'purple', display: 'flex', flexDirection: 'column', width: '400px', margin: '0 auto' }}>
    {list.map((item) => (
      <Item
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
        />
    ))}
  </ul>
)

const Item = ({item, onRemoveItem}) => {
  return (
    <li style={{ paddingBottom: '12px', listStyle: 'inside square', display: 'grid', gridTemplateColumns: '1fr 3fr 1fr 1fr', columnGap: '18px' }}>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </li>
  )
}



const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleFetchStories = React.useCallback(() => {
    if (!searchTerm) return;

    dispatchStories({ type: 'STORIES_FETCH_INIT' });
    
    fetch(`${API_ENDPOINT}${searchTerm}`)
    .then((response) => response.json())
    .then(result => {
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    })
    .catch(() => 
      dispatchStories({ type: 'STORIES_FETCH_FAILURE' })
    );
  }, [searchTerm]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleRemovedStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  }

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (

    <div className="App">
      <h1>My Hacker Stories</h1>

      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <List
          list={searchedStories}
          onRemoveItem={handleRemovedStory}
        />
      )}
    </div>
  );
};

export default App;