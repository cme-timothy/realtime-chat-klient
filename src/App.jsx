import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Main from "./components/Main";

function App() {
  return (
    <div>
      <HelmetProvider>
        <Router>
          <Main />
        </Router>
      </HelmetProvider>
    </div>
  );
}

export default App;
