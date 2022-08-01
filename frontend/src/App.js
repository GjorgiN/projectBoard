import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyNavbar from "./Components/MyNavbar";
import Register from "./Components/Register";
import Home from "./Pages/Home";
import Project from "./Pages/Project";
import { useState } from "react";

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  return (

    <BrowserRouter>
      {isLoggedIn && <MyNavbar />}
      <Routes>
        <Route exact path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="register" element={<Register />} />
        <Route path="/project/:projectId" element={<Project isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
