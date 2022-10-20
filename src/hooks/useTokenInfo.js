/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { multicall } from "../utils/contracts";
import PriceABI from "../abis/PriceABI.json";
import ValutABI from "../abis/ValutABI.json";
import {
  BTC_ADDR,
  ETH_ADDR,
  PRICE_ADDR,
  USDC_ADDR,
  VAULT_ADDR,
} from "../abis/address";

import { Token } from "@uniswap/sdk-core";
import IUniswapV3Pool from "../abis/IUniswapV3Pool.json";

import { Pool } from "@uniswap/v3-sdk/";
import { ethers } from "ethers";

const defaultVal = {
  fetchData: () => { },
  totalUSDValuts: 0,
  GLPinVault: 0,
  GLPPrice: 0,
  totalFees: 0,
  GLPbackingNeeded: 0,
  price: 0,
  pool: [{}, {}, {}],
};

export const TokenInfoContext = React.createContext(defaultVal);

export default function useTokenInfo() {
  return React.useContext(TokenInfoContext);
}
let dataid = null;

const provider = new ethers.providers.JsonRpcProvider(
  "https://arb1.arbitrum.io/rpc"
);

// pool address for DAI/USDC 0.05%
const poolAddress = "0xF82D8ecFbCd7845e40E97EE7f6BAb12cD921Dd03";

const poolContract = new ethers.Contract(poolAddress, IUniswapV3Pool, provider);

export function TokenInfoProvider({ children }) {
  const [totalUSDValuts, setTotalUSDValuts] = useState(0);
  const [GLPinVault, setGLPInValut] = useState(0);
  const [GLPPrice, setGLPPrice] = useState(0);
  const [totalFees, setTotalFees] = useState(0);
  const [GLPbackingNeeded, setGLPBackingNeeded] = useState(0);
  const [price, setPrice] = useState(0);

  const [pool, setPool] = useState([
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
      vaultcap: 0,
      stakable: false,
      withdrawable: false,
    },
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
      vaultcap: 0,
      stakable: false,
      withdrawable: false,
    },
    {
      price: 0,
      pool: 0,
      weight: 0,
      apr: 0,
      totalStaked: 0,
      vaultcap: 0,
      stakable: false,
      withdrawable: false,
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
        { address: VAULT_ADDR, params: [0], name: "GDpriceToStakedtoken" },
        { address: VAULT_ADDR, params: [1], name: "GDpriceToStakedtoken" },
        { address: VAULT_ADDR, params: [2], name: "GDpriceToStakedtoken" },
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
        (result[2].totalStaked * _prices[1][0]) / Math.pow(10, 48);
      const ETHSAmount =
        (result[3].totalStaked * _prices[2][0]) / Math.pow(10, 48);
      const BTCSAmount =
        (result[4].totalStaked * _prices[3][0]) / Math.pow(10, 48);
      let _totalUSDValuts = USDCSAmount + ETHSAmount + BTCSAmount;
      setTotalUSDValuts(_totalUSDValuts);
      console.log(result[2].vaultcap, result[2].totalStaked);
      setPool([
        {
          price: _prices[1][0] / Math.pow(10, 30),
          pool: USDCSAmount,
          weight: (USDCSAmount / _totalUSDValuts) * 100,
          apr: result[2].APR / 100 + 1,
          totalStaked: result[2].totalStaked,
          GDpriceToStakedToken: result[5][0],
          withdrawable: result[2].withdrawable,
          stakable: result[2].stakable,
          vaultcap: result[2].vaultcap,
        },
        {
          price: _prices[2][0] / Math.pow(10, 30),
          pool: ETHSAmount,
          weight: (ETHSAmount / _totalUSDValuts) * 100,
          apr: result[3].APR / 100 + 1,
          totalStaked: result[3].totalStaked,
          GDpriceToStakedToken: result[6][0],
          withdrawable: result[3].withdrawable,
          stakable: result[3].stakable,
          vaultcap: result[3].vaultcap,
        },
        {
          price: _prices[3][0] / Math.pow(10, 30),
          pool: BTCSAmount,
          weight: (BTCSAmount / _totalUSDValuts) * 100,
          apr: result[4].APR / 100 + 1,
          totalStaked: result[4].totalStaked,
          GDpriceToStakedToken: result[7][0],
          withdrawable: result[4].withdrawable,
          stakable: result[4].stakable,
          vaultcap: result[4].vaultcap,
        }
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  async function getPoolImmutables() {
    const immutables = {
      factory: await poolContract.factory(),
      token0: await poolContract.token0(),
      token1: await poolContract.token1(),
      fee: await poolContract.fee(),
      tickSpacing: await poolContract.tickSpacing(),
      maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
    };
    return immutables;
  }

  async function getPoolState() {
    const slot = await poolContract.slot0();
    const PoolState = {
      liquidity: await poolContract.liquidity(),
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    };
    return PoolState;
  }

  async function fetchPrice() {
    const immutables = await getPoolImmutables();
    const state = await getPoolState();
    const DAI = new Token(42161, immutables.token0, 18, "GMD", "GMD Coin");
    const USDC = new Token(42161, immutables.token1, 6, "USDC", "USD Coin");
    console.log(immutables, state);

    //create a pool
    const DAI_USDC_POOL = new Pool(
      USDC,
      DAI,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );
    const price1 = await DAI_USDC_POOL.token0Price;
    const price2 = await DAI_USDC_POOL.token1Price;
    console.log("Price", price1.toFixed(10), price2.toFixed(10));
    setPrice(Number(price1.toFixed(10)));
  }

  useEffect(() => {
    fetchData();
    fetchPrice();
    if (dataid) clearInterval(dataid);
    dataid = setInterval(() => {
      fetchPrice();
      fetchData();
    }, 20000);
  }, []);

  return (
    <TokenInfoContext.Provider
      value={{
        price,
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
