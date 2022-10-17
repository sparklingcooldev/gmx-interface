import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useWeb3Context } from "./hooks/web3Context";

import { Box } from "@mui/material";
import TopBar from "./components/TopBar/TopBar";
import Dashboard from "./pages/Dashboard";
import Earn from "./pages/Earn";
import ComingSoon from "./pages/ComingSoon";
import Footer from "./components/Footer";
import MintGMD from "./pages/Mint";

import "./App.css";
import Notification from "./components/Notification";

function App() {
  const { connect, hasCachedProvider } = useWeb3Context();

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then((msg) => {
        if (msg.type === "error") {
          setNotification(msg);
        }
      });
    } else {
      // then user DOES NOT have a wallet
    }
    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menus = [
    "HOME",
    "TOKENOMICS",
    "ROAD MAP",
    "VALUES",
    "CURRENCT RESCUE",
    "TEAM",
    "STORE",
    "BUY TOKEN",
  ];

  const [activePage, setActivePage] = useState(1);
  return (
    <BrowserRouter>
      <TopBar
        setNotification={setNotification}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <Box position="relative">
        <Routes>
          {menus.map((data, i) => {
            return (
              <Route
                key={i}
                path={`/${data.replace(" ", "").toLowerCase()}`}
                element={<ComingSoon />}
              />
            );
          })}
          <Route path="/" element={<Navigate replace to="/dashboard" />} />
          <Route
            exact
            path="/dashboard"
            element={<Dashboard setNotification={setNotification} />}
          />
          <Route
            exact
            path="/earn"
            element={<Earn setNotification={setNotification} />}
          />
          <Route
            exact
            path="/mintgmd"
            element={<MintGMD setNotification={setNotification} />}
          />
        </Routes>
      </Box>
      <Footer />
      <Notification data={notification} />
    </BrowserRouter>
  );
}

export default App;
