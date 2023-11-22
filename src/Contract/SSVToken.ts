import {createTrancation, getContract, sendSignedTransaction} from "./Contract";
import {CLUSTER_OWENER_ADDRESS, getPrivateKey, SSV_ADDRESS, SSV_TOKEN_ADDRESS, SSVToken_ABI} from "../config";
import {Contract} from "web3-eth-contract";

let ssvtoken: Contract | null = null;
const SSVToken = async (): Promise<Contract> => {
  if (ssvtoken) {
    return ssvtoken;
  }
  const options = {from: CLUSTER_OWENER_ADDRESS}
  ssvtoken = await getContract(SSVToken_ABI, SSV_TOKEN_ADDRESS, options);
  return ssvtoken;
}

const allowance = async () => {
  const ssv = await SSVToken();
  return await ssv.methods.allowance(CLUSTER_OWENER_ADDRESS, SSV_ADDRESS).call();
}

const balanceOf = async () => {
  const ssv = await SSVToken();
  return await ssv.methods.balanceOf(CLUSTER_OWENER_ADDRESS).call();
}

const increaseAllowance = async (addedValue: string) => {
  const ssv = await SSVToken();
  const contractMethod = ssv.methods.increaseAllowance(SSV_ADDRESS, addedValue);
  const tx = await createTrancation(SSV_TOKEN_ADDRESS, contractMethod, getPrivateKey());
  if (tx.rawTransaction) {
    return await sendSignedTransaction(tx);
  }
  throw new Error('increaseAllowance failed');
}

export {
  allowance,
  balanceOf,
  increaseAllowance
}
