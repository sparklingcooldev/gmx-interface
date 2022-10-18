/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getMulticallContract,
  getTokenContract,
  multicall,
} from "../utils/contracts";
import ValutABI from "../abis/ValutABI.json";
import ERC20ABI from "../abis/ERC20ABI.json";
import MINTABI from "../abis/MintABI.json";
import {
  BTC_ADDR,
  ETH_ADDR,
  GDlptoken,
  MINT_ADDR,
  USDC_ADDR,
  VAULT_ADDR,
} from "../abis/address";
import { useAddress } from "./web3Context";
import { ethers } from "ethers";

const defaultVal = {
  mintData: {},
  mintAccountData: {},
  allowance: false,
  fetchMintData: () => {},
  fetchMintAccountData: () => {},
};

export const MintInfoContext = React.createContext(defaultVal);

export default function useMintInfo() {
  return React.useContext(MintInfoContext);
}
let dataid = null,
  accountid = null;

export function MintInfoProvider({ children }) {
  const account = "0x3014D0Fed2f03296CCa53275353054bcf1b78e13";
  const [mintData, setMintData] = useState({
    mintPrice: 0,
    mintCap: 0,
    remainingTokens: 0,
    mintOpen: false,
    totalSupply: 0,
  });
  const [mintAccountData, setMintAccountData] = useState({
    mintedAmount: 0,
    vestPeriod: 0,
    claimableTokens: 0,
  });
  const [allowance, setAllowance] = useState(false);

  async function fetchMintData() {
    try {
      let calls = [
        {
          address: MINT_ADDR,
          name: "mintPrice",
          params: [],
        },
        {
          address: MINT_ADDR,
          name: "mintCap",
          params: [],
        },
        { address: MINT_ADDR, name: "remainingMintableTokens", params: [] },
        { address: MINT_ADDR, name: "totalSupply", params: [] },
        { address: MINT_ADDR, name: "mintOpen", params: [] },
      ];
      const result = await multicall(MINTABI, calls);
      console.log(result);
      setMintData({
        mintPrice: result[0][0] / 1000,
        mintCap: result[1][0] / Math.pow(10, 18),
        remainingTokens: result[2][0] / Math.pow(10, 18),
        mintOpen: result[4][0],
        totalSupply: result[3][0] / Math.pow(10, 18),
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchMintAccountData() {
    try {
      const usdcContract = getTokenContract(USDC_ADDR);
      const allowance = await usdcContract.allowance(account, MINT_ADDR);
      console.log(allowance);
      setAllowance(allowance > ethers.utils.parseUnits("10000", "6"));
      let calls = [
        {
          address: MINT_ADDR,
          name: "userInfo",
          params: [account],
        },
        {
          address: MINT_ADDR,
          name: "claimableTokens",
          params: [account],
        },
      ];
      const result = await multicall(MINTABI, calls);
      console.log(result);
      setMintAccountData({
        mintedAmount: result[0].totalMinted / Math.pow(10, 18),
        vestPeriod: result[0].VestPeriod / 1,
        claimableTokens: result[1][0] / Math.pow(10, 18),
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchMintData();
    if (dataid) clearInterval(dataid);
    dataid = setInterval(() => {
      fetchMintData();
    }, 20000);
  }, []);

  useEffect(() => {
    if (!account) return;
    fetchMintAccountData();
    if (accountid) clearInterval(accountid);
    accountid = setInterval(() => {
      fetchMintAccountData();
    }, 20000);
  }, [account]);

  return (
    <MintInfoContext.Provider
      value={{
        mintData,
        mintAccountData,
        allowance,
        fetchMintAccountData,
        fetchMintData,
      }}
      children={children}
    />
  );
}
