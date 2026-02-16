import { useState } from "react";
import Page from "./components/Page/Page";
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <div
      className="App"
      style={{
        backgroundColor: isDark ? "#000000" : "#ffffff",
        transition: "background-color 0.3s ease",
      }}
    >
      <ThemeToggle onThemeChange={setIsDark} />
      <Page isDark={isDark} />
    </div>
  );
}

export default App;
