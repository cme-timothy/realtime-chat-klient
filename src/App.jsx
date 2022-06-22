import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";
import SocketContext from "./context/socket";
import { io } from "socket.io-client";
import Main from "./components/Main";

const socket = io("http://localhost:4000");

function App() {
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <HelmetProvider>
          <Router>
            <RecoilRoot>
              <Main />
            </RecoilRoot>
          </Router>
        </HelmetProvider>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
