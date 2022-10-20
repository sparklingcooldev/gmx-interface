import { ethers } from "ethers";
import {
  GMD_STAKING_ADDR,
  MINT_ADDR,
  MULTICALL_ADDR,
  PRICE_ADDR,
  VAULT_ADDR,
} from "../abis/address";
import MultiCallABI from "../abis/MultiCallABI.json";
import ERC20ABI from "../abis/ERC20ABI.json";
import VaultABI from "../abis/ValutABI.json";
import PriceABI from "../abis/PriceABI.json";
import MintABI from "../abis/MintABI.json";
import GMDStakingABI from '../abis/GMDStakingABI.json'

export const RPC_ENDPOINT = "https://arb1.arbitrum.io/rpc";

export const getContract = (abi, address, signer) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};
export const getTokenContract = (address, signer) => {
  return getContract(ERC20ABI, address, signer);
};
export const getVaultContract = (signer) => {
  return getContract(VaultABI, VAULT_ADDR, signer);
};

export const getPriceContract = (signer) => {
  return getContract(PriceABI, PRICE_ADDR, signer);
};

export const getMintContract = (signer) => {
  return getContract(MintABI, MINT_ADDR, signer);
};

export const getGMDStakingContract = (signer) => {
  return getContract(GMDStakingABI, GMD_STAKING_ADDR, signer);
};

export const getMulticallContract = (signer) => {
  return getContract(MultiCallABI, MULTICALL_ADDR, signer);
};

export const multicall = async (abi, calls) => {
  try {
    const itf = new ethers.utils.Interface(abi);
    const multi = getMulticallContract();
    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);

    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );

    return res;
  } catch (error) {
    console.log(error);
  }
};
