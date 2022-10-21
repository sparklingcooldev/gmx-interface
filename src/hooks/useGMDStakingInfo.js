/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { getMulticallContract, multicall } from "../utils/contracts";
import ValutABI from "../abis/ValutABI.json";
import ERC20ABI from "../abis/ERC20ABI.json";
import GMDStakingABI from "../abis/GMDStakingABI.json";
import {
  BTC_ADDR,
  ETH_ADDR,
  GDlptoken,
  GMD_ADDR,
  GMD_STAKING_ADDR,
  MINT_ADDR,
  USDC_ADDR,
  VAULT_ADDR,
} from "../abis/address";
import { useAddress } from "./web3Context";
import { ethers } from "ethers";

const defaultVal = {
  allowance: 0,
  balance: 0,
  totalStaked: 0,
  withdrawable: false,
  apy: 0,
  reward: 0,
  stakedAmount: 0,
  fetchStakingData: () => {},
  fetchStakingAccountData: () => {},
};

export const GMDStakingInfoContext = React.createContext(defaultVal);

export default function useGMDStakingInfo() {
  return React.useContext(GMDStakingInfoContext);
}
let dataid = null,
  accountid = null;

export function GMDStakingInfoProvider({ children }) {
  const account = useAddress();
  const [allowance, setAllowance] = useState(false);
  const [balance, setBalance] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [withdrawable, setWithdrawable] = useState(false);
  const [apy, setAPY] = useState(0);
  const [reward, setReward] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);

  async function fetchStakingData() {
    try {
      let calls = [
        {
          address: GMD_STAKING_ADDR,
          name: "poolInfo",
          params: [0],
        },
        {
          address: GMD_STAKING_ADDR,
          name: "withdrawable",
          params: [],
        },
      ];
      const result = await multicall(GMDStakingABI, calls);
      setAPY(result[0].allocPoint / 100);
      setWithdrawable(result[1][0]);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchStakingAccountData() {
    try {
      let calls = [
        {
          address: GMD_ADDR,
          name: "allowance",
          params: [account, GMD_STAKING_ADDR],
        },
        {
          address: GMD_ADDR,
          name: "balanceOf",
          params: [account],
        },
        {
          address: GMD_ADDR,
          name: "balanceOf",
          params: [GMD_STAKING_ADDR],
        },
      ];

      let result = await multicall(ERC20ABI, calls);
      setAllowance(result[0][0] > ethers.utils.parseEther("10000"));
      setBalance(result[1][0]);
      setTotalStaked(result[2][0] / Math.pow(10, 18));

      calls = [
        {
          address: GMD_STAKING_ADDR,
          name: "userInfo",
          params: [0, account],
        },
        {
          address: GMD_STAKING_ADDR,
          name: "pendingWETH",
          params: [0, account],
        },
      ];

      result = await multicall(GMDStakingABI, calls);
      setReward(result[1][0] / Math.pow(10, 18));
      setStakedAmount(result[0].amount);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStakingData();
    if (dataid) clearInterval(dataid);
    dataid = setInterval(() => {
      fetchStakingData();
    }, 20000);
  }, []);

  useEffect(() => {
    if (!account) return;
    fetchStakingAccountData();
    if (accountid) clearInterval(accountid);
    accountid = setInterval(() => {
      fetchStakingAccountData();
    }, 20000);
  }, [account]);

  return (
    <GMDStakingInfoContext.Provider
      value={{
        allowance,
        balance,
        totalStaked,
        withdrawable,
        apy,
        reward,
        stakedAmount,
        fetchStakingData,
        fetchStakingAccountData,
      }}
      children={children}
    />
  );
}
