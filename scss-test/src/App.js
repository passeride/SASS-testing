import React from 'react';
import './App.scss';
import ConsoleTesting from './components/ConsoleTesting/ConsoleTesting.jsx';
import FlexBox from './components/FlexBox/FlexBox.jsx';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";


function App() {
  return (
      <Router>
        <div className="App">
          <nav>
            <ul>
              <a href="/ConsoleTesting"><li>Console Testing</li></a>
              <a href="/"><li>Flexbox</li></a>
              <a href=""><li>Something else 1</li></a>
              <a href=""><li>Also another</li></a>
              <a href=""><li>Snex</li></a>
            </ul>
          </nav>
          <Switch>
            <Route path="/ConsoleTesting"><ConsoleTesting/></Route>
            <Route path="/"><FlexBox/></Route>
          </Switch>
        </div>
      </Router>
  );
}

export default App;
