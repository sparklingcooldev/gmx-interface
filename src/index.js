import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GlobalProvider } from "./context/GlobalContext";
import { Web3ContextProvider } from "./hooks/web3Context";
import { TokenInfoProvider } from "./hooks/useTokenInfo";
import { LockInfoProvider } from "./hooks/useLockInfo";
import { MintInfoProvider } from "./hooks/useMintInfo";
import { GMDStakingInfoProvider } from "./hooks/useGMDStakingInfo";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <Web3ContextProvider>
        <TokenInfoProvider>
          <LockInfoProvider>
            <MintInfoProvider>
              <GMDStakingInfoProvider>
                <App />
              </GMDStakingInfoProvider>
            </MintInfoProvider>
          </LockInfoProvider>
        </TokenInfoProvider>
      </Web3ContextProvider>
    </GlobalProvider>
  </React.StrictMode>
);
