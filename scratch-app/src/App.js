import React from 'react';
import MyComp from './MyComp.jsx';
import './App.scss';


function App(){
    return (
        <div className="App">
          <header className="App-header">
            <h1>Darling are you ready for more</h1>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <div>hey normal</div>
            <MyComp/>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
}

export default App;
