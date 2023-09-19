import './App.css';
import * as React from "react";
//import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Navbar from './Components/Navbar';
import { Home } from './Components/Home';
import About from './Components/About';
import NoteState from './Context/notes/NoteState';


function App() {
  return (
    <>
    <NoteState>
    <Router>
        <Navbar/>
        
        <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/about" element={<About/>}/>
            
        </Routes>
    </Router>
    </NoteState>
    </>
  );
}

export default App;
