import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { RecoilRoot } from "recoil";
import SocketContext from "./context/socket";
import { io } from "socket.io-client";
import Main from "./components/Main";
import Header from "./components/Header";
import { ChakraProvider } from "@chakra-ui/react";
import Footer from "./components/Footer";

const socket = io("http://localhost:4000");

function App() {
  return (
    <div>
      <SocketContext.Provider value={socket}>
        <ChakraProvider>
          <HelmetProvider>
            <Router>
              <RecoilRoot>
                <Header />
                <Main />
                <Footer />
              </RecoilRoot>
            </Router>
          </HelmetProvider>
        </ChakraProvider>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
