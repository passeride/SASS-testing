import React from 'react';
import './App.scss';
import ConsoleTesting from './components/ConsoleTesting/ConsoleTesting.jsx';
import FlexBox from './components/FlexBox/FlexBox.jsx';
import WebGlTest from './components/WebGlTest/WebGlTest.jsx';
import Three from './components/Three/Three.jsx';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

function App() {
    return (
        <Router>
          <div className="App">
            <div className="NavBar">
              <nav>
                <ul>
                  <a href="/ConsoleTesting"><li>Console Testing</li></a>
                  <a href="/"><li>Flexbox</li></a>
                  <a href="/WebGlTest"><li>WebGlTest</li></a>
                  <a href="/Three"><li>Three</li></a>
                  <a href="/"><li>Snex</li></a>
                </ul>
              </nav>
            </div>
            <div>
              <Switch>
                <Route path="/ConsoleTesting"><ConsoleTesting/></Route>
                <Route path="/WebGlTest"><WebGlTest/></Route>
                <Route path="/Three"><Three/></Route>
                <Route path="/"><FlexBox/></Route>
              </Switch>
            </div>
          </div>
        </Router>
    );
}

export default App;
