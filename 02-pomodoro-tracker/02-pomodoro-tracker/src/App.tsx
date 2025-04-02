import { useState } from "react";
import "./App.css";
import Toggle from "./components/Toggle/Toggle";
import TrackerCard from "./components/TrackerCard/TrackerCard";

function App() {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useState(preference);

  return (
    <div className="App" data-theme={isDark ? "dark" : "light"}>
      <Toggle isChecked={isDark} handleChange={() => setIsDark(!isDark)} />
      <div className="circle__right"></div>
      <TrackerCard />
      <div className="circle__left"></div>
    </div>
  );
}

export default App;
