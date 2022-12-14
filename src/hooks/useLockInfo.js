/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getMulticallContract, multicall } from "../utils/contracts";
import ValutABI from "../abis/ValutABI.json";
import ERC20ABI from "../abis/ERC20ABI.json";
import {
  BTC_ADDR,
  ETH_ADDR,
  GDlptoken,
  USDC_ADDR,
  VAULT_ADDR,
} from "../abis/address";
import { useAddress } from "./web3Context";
import { ethers } from "ethers";

const defaultVal = {
  accountData: [{}, {}, {}],
  fetchAccountData: () => { },
};

export const LockInfoContext = React.createContext(defaultVal);

export default function useLockInfo() {
  return React.useContext(LockInfoContext);
}
let dataid = null;

export function LockInfoProvider({ children }) {
  const account = useAddress();
  const [accountData, setAccountData] = useState([
    { balance: 0, stakedAmount: 0, allowance: false, ethBalance: 0 },
    { balance: 0, stakedAmount: 0, allowance: false, ethBalance: 0 },
    { balance: 0, stakedAmount: 0, allowance: false, ethBalance: 0 },
  ]);
  async function fetchAccountData() {
    try {
      let calls = [
        { address: USDC_ADDR, name: "balanceOf", params: [account] },
        { address: ETH_ADDR, name: "balanceOf", params: [account] },
        { address: BTC_ADDR, name: "balanceOf", params: [account] },
        {
          address: USDC_ADDR,
          name: "allowance",
          params: [account, VAULT_ADDR],
        },
        { address: ETH_ADDR, name: "allowance", params: [account, VAULT_ADDR] },
        {
          address: BTC_ADDR,
          name: "allowance",
          params: [account, VAULT_ADDR],
        },
        { address: GDlptoken[0], name: "balanceOf", params: [account] },
        { address: GDlptoken[1], name: "balanceOf", params: [account] },
        { address: GDlptoken[2], name: "balanceOf", params: [account] },
      ];
      const _balances = await multicall(ERC20ABI, calls);
      calls = [];
      console.log(_balances);
      for (let i = 0; i < 3; i++) {
        calls.push({
          address: VAULT_ADDR,
          name: "displayStakedBalance",
          params: [account, i],
        });
      }
      const _stakedAmounts = await multicall(ValutABI, calls);
      const multicallContract = getMulticallContract();
      const ethBalance = await multicallContract.getEthBalance(account);
      console.log(ethBalance);
      let temp = [];
      for (let i = 0; i < 3; i++) {
        temp.push({
          balance: _balances[i][0],
          stakedAmount: _stakedAmounts[i][0],
          allowance: _balances[i + 3][0] > ethers.utils.parseEther("10000"),
          ethBalance,
          gdBalance: _balances[i + 6],
        });
      }
      console.log(temp);
      setAccountData(temp);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!account) return;
    fetchAccountData();
    if (dataid) clearInterval(dataid);
    dataid = setInterval(() => {
      fetchAccountData();
    }, 20000);
  }, [account]);

  return (
    <LockInfoContext.Provider
      value={{
        accountData,
        fetchAccountData,
      }}
      children={children}
    />
  );
}
