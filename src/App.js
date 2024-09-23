import React, { createContext } from "react";
import { BrowserRouter as Router,
         Routes,
         Route
        } from "react-router-dom";

import { DataProvider } from "./Components/DataContext";
import Scorecards from "./Components/Scorecards";
import Scorecard from "./Components/Scorecard";
import './App.css';

// Create a new context and export
export const NameContext = createContext();

// Create a context provider



function App() {
  return (
    <div>
      <Router>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Scorecards />} />
            <Route path="/scorecard" element={<Scorecard />}  />
          </Routes>
        </DataProvider>
      </Router>
    </div>
  );
}

export default App;
