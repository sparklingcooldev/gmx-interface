/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  getPriceContract,
  getVaultContract,
  multicall,
} from "../utils/contracts";
import PriceABI from "../abis/PriceABI.json";
import ValutABI from "../abis/ValutABI.json";
import {
  BTC_ADDR,
  ETH_ADDR,
  PRICE_ADDR,
  USDC_ADDR,
  VAULT_ADDR,
} from "../abis/address";
import axios from "axios";

const defaultVal = {
  fetchData: () => {},
  totalUSDValuts: 0,
  GLPinVault: 0,
  GLPPrice: 0,
  totalFees: 0,
  GLPbackingNeeded: 0,
  pool: [{}, {}, {}],
};

export const TokenInfoContext = React.createContext(defaultVal);

export default function useTokenInfo() {
  return React.useContext(TokenInfoContext);
}
let dataid = null;

export function TokenInfoProvider({ children }) {
  const [totalUSDValuts, setTotalUSDValuts] = useState(0);
  const [GLPinVault, setGLPInValut] = useState(0);
  const [GLPPrice, setGLPPrice] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [GLPbackingNeeded, setGLPBackingNeeded] = useState(0);

  const [pool, setPool] = useState([
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
    },
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
    },
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
    },
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
    },
  ]);

  async function fetchData() {
    try {
      let calls = [
        {
          address: VAULT_ADDR,
          params: [],
          name: "GLPinVault",
        },
        {
          address: VAULT_ADDR,
          params: [],
          name: "GLPbackingNeeded",
        },
        { address: VAULT_ADDR, params: [0], name: "poolInfo" },
        { address: VAULT_ADDR, params: [1], name: "poolInfo" },
        { address: VAULT_ADDR, params: [2], name: "poolInfo" },
      ];
      const result = await multicall(ValutABI, calls);
      setGLPInValut(result[0][0] / Math.pow(10, 18));
      setGLPBackingNeeded(result[1][0] / Math.pow(10, 18));

      calls = [
        { address: PRICE_ADDR, params: [], name: "getGLPprice" },
        { address: PRICE_ADDR, params: [USDC_ADDR], name: "getPrice" },
        { address: PRICE_ADDR, params: [ETH_ADDR], name: "getPrice" },
        { address: PRICE_ADDR, params: [BTC_ADDR], name: "getPrice" },
      ];
      const _prices = await multicall(PriceABI, calls);
      setGLPPrice(_prices[0][0] / Math.pow(10, 18));
      const USDCSAmount =
        (result[2].totalStaked * _prices[1][0]) / Math.pow(10, 36);
      const ETHSAmount =
        (result[3].totalStaked * _prices[2][0]) / Math.pow(10, 48);
      const BTCSAmount =
        (result[4].totalStaked * _prices[3][0]) / Math.pow(10, 38);
      let _totalUSDValuts = USDCSAmount + ETHSAmount + BTCSAmount;
      setTotalUSDValuts(_totalUSDValuts);
      setPool([
        {
          price: _prices[1][0] / Math.pow(10, 30),
          pool: USDCSAmount,
          weight: (USDCSAmount / _totalUSDValuts) * 100,
          apr: result[2].APR / 100,
          totalStaked: result[2].totalStaked,
        },
        {
          price: _prices[2][0] / Math.pow(10, 30),
          pool: ETHSAmount,
          weight: (ETHSAmount / _totalUSDValuts) * 100,
          apr: result[3].APR / 100,
          totalStaked: result[3].totalStaked,
        },
        {
          price: _prices[3][0] / Math.pow(10, 30),
          pool: BTCSAmount,
          weight: (BTCSAmount / _totalUSDValuts) * 100,
          apr: result[4].APR / 100,
          totalStaked: result[4].totalStaked,
        },
        {
          price: 0,
          pool: 0,
          weight: 0,
          apr: 0,
          totalStaked: 0,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    if (dataid) clearInterval(dataid);
    dataid = setInterval(() => {
      fetchData();
    }, 20000);
  }, []);

  return (
    <TokenInfoContext.Provider
      value={{
        totalUSDValuts,
        GLPinVault,
        GLPPrice,
        totalFees,
        GLPbackingNeeded,
        pool,
        fetchData,
      }}
      children={children}
    />
  );
}