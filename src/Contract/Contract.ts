import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {Contract, ContractOptions} from "web3-eth-contract";
import {SignedTransaction} from "web3-core";
import {CLUSTER_OWENER_ADDRESS, GETH_NODE_URL, MAXGasPrice, PendingPath} from "../config";
import {ssvValidatorLogger} from "../tool/logger";
import {deleteFile, writeFile} from "../tool/file";
import path from "path";
import {getGasOracle} from "../tool/tools";

const web3 = new Web3(GETH_NODE_URL)

let nounce = 0;

const getNounce = async (): Promise<number> => {
  const newNounce = await getWeb3Instanse().eth.getTransactionCount(CLUSTER_OWENER_ADDRESS);
  if (newNounce > nounce + 1) {
    nounce = newNounce;
  } else {
    nounce++;
  }

  return nounce
}

export const getWeb3Instanse = () => {
  return web3;
}

export const getContract = async (jsonInterface: AbiItem[] | AbiItem, address?: string, options?: ContractOptions): Promise<Contract> => {
  return new web3.eth.Contract(jsonInterface, address, options)
}

export const getContractMethod = (contract: Contract, method: string, args?: any[]) => {
  return contract.methods[method](...args || [])
}

export const createTrancation = async (contractAddress: string, contractMethod: any, privateKey: string): Promise<SignedTransaction> => {
  const gas = await contractMethod.estimateGas();
  const gasOracle = await getGasOracle();
  let gasPrice = Number((Number(gasOracle?.result?.SafeGasPrice) * 1.2).toFixed(2));

  gasPrice = Math.min(gasPrice, MAXGasPrice)
  return await getWeb3Instanse().eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: contractMethod.encodeABI(),
        gas: Math.floor(gas * 1.4),
        gasPrice: Web3.utils.toWei(String(gasPrice), 'gwei'),
        nonce: await getNounce(),
      },
      privateKey
  );
}


export const sendSignedTransaction = async (signedTransaction: SignedTransaction, callback?: (() => void) | undefined): Promise<Boolean> => {
  if (!signedTransaction.transactionHash) {
    return false
  }
  const hash = signedTransaction.transactionHash;
  const filePath = path.join(PendingPath, signedTransaction.transactionHash);
  try {
    await getWeb3Instanse().eth.sendSignedTransaction(signedTransaction.rawTransaction!)
    if (callback) {
      ssvValidatorLogger.log("run call back", signedTransaction.transactionHash);
      callback();
    }

    return true
  } catch (e) {
    ssvValidatorLogger.log("sendSignedTransaction error", e.message)
    if (e.message.includes('Transaction was not mined within')) {
      ssvValidatorLogger.log("Transaction was not mined within: ", signedTransaction.transactionHash);
      writeFile(filePath, signedTransaction.transactionHash)
      const interval = setInterval(function () {
        ssvValidatorLogger.log("Attempting to get transaction receipt...", hash);
        web3.eth.getTransactionReceipt(hash, function (err, rec) {
          if (rec) {
            ssvValidatorLogger.log("Transaction success", rec.transactionHash);
            clearInterval(interval);
            deleteFile(filePath);
          }
        });
      }, 3000);
      if (callback) {
        callback();
      }
      return true;
    } else {
      ssvValidatorLogger.error('sendSignedTransaction', e);
      return false;
    }
  }
}
