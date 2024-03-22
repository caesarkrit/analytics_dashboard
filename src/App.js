import logo from "./logo.svg";
import "./App.css";
import Home from "./routes/home/home";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        {/* <Route index element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="contact-us" element={<Contact />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
