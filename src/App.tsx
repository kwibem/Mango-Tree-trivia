import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from "./pages/home";
import Game from "./pages/game";
import Final from "./pages/final";
import GuestModal from "./components/GuestModal/GuestModal";
import Navigation from "./components/navigation";
import { GameStatusProvider, useGameStatus } from "./utils/GameStatusContext";
import { GUEST_NAME_KEY } from "./utils/guestName";

// The single app-wide navbar. Shows the guest name on every route and the
// game-only Round + Points indicators when on the /game route. Uses useLocation,
// so it must be rendered inside <Router>.
function AppNavbar(): React.JSX.Element {
  const location = useLocation();
  const { points, round } = useGameStatus();
  const isGameRoute = location.pathname === "/game";

  return (
    <Navigation
      round={isGameRoute ? round : undefined}
      points={isGameRoute ? points : undefined}
    />
  );
}

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
      <GameStatusProvider>
        <Router>
          {guestName && <AppNavbar />}
          <Routes>
            <Route index element={ <Home/> } />
            <Route path="/game" element={<Game/>} />
            <Route path="/final" element={<Final/>} />
          </Routes>
        </Router>
      </GameStatusProvider>
    </div>
  );
}
export default App;
