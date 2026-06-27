import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/home";
import Game from "./pages/game";
import Final from "./pages/final";
import GuestModal from "./components/GuestModal/GuestModal";
import { GUEST_NAME_KEY } from "./utils/guestName";
import "./App.css";
import "./components/navigation/Navigation.css";

function App(): React.JSX.Element {
  const [guestName, setGuestName] = React.useState<string | null>(
    () => sessionStorage.getItem(GUEST_NAME_KEY)
  );

  const handleGuestSubmit = (name: string): void => {
    sessionStorage.setItem(GUEST_NAME_KEY, name);
    setGuestName(name);
  };

  return (
    <div className="App">
      {!guestName && <GuestModal onSubmit={handleGuestSubmit} />}
      {guestName && (
        <header className="app-header">
          <span className="navigation__guest-name" title={guestName}>
            {guestName}
          </span>
        </header>
      )}
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
