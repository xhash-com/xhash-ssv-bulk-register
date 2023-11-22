import {GenesisBlock, SSV_ABI} from "../../config";
import Web3 from "web3";

export default class Web3Provider {
  static BLOCK_RANGE_500K = 500000;

  static get abi() {
    return SSV_ABI as any;
  }

  static web3(nodeUrl: string = '') {
    return new Web3(nodeUrl);
  }

  static contract(nodeUrl: string, contractAddress: string) {
    return new (Web3Provider.web3(nodeUrl)).eth.Contract(
        Web3Provider.abi,
        contractAddress,
    );
  }

  static async getGenesisBlock(nodeUrl: string, contractAddress: string) {
    return GenesisBlock;
  }
}
