import { ethers } from "ethers";
import { MULTICALL_ADDR, ZENA_ADDR, LOCK_ADDR, FARM_ADDR, PAIR_ADDR } from "../abis/address";
import MultiCallABI from "../abis/MultiCallABI.json";
import ERC20ABI from "../abis/ERC20ABI.json";
import FarmABI from "../abis/FarmABI.json";
import LockABI from "../abis/LockABI.json";
import PairABI from "../abis/PancakePairABI.json";

export const RPC_ENDPOINT = "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

export const getContract = (abi, address, signer) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getTokenContract = (signer) => {
  return getContract(ERC20ABI, ZENA_ADDR, signer);
};
export const getLockContract = (signer) => {
  return getContract(LockABI, LOCK_ADDR, signer);
};

export const getPairContract = (signer) => {
  return getContract(PairABI, PAIR_ADDR, signer);
};

export const getFarmContract = (signer) => {
  return getContract(FarmABI, FARM_ADDR, signer);
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
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  } catch (error) {
    console.log(error);
  }
};
