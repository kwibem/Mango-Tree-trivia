import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import Game from "./pages/game";
import Final from "./pages/final";

function App(): JSX.Element {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={ <Home/> } />
          <Route path="/game" element={<Game/>} />
          <Route path="/final" element={<Final/>} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
