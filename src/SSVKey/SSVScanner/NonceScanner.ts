import Web3Provider from './web3.provider';

import {BaseScanner} from './BaseScanner';

export class NonceScanner extends BaseScanner {
  protected eventsList = [
    'ValidatorAdded',
  ];

  async run(cli = false): Promise<number> {
    try {
      const data = await this._getLatestNonce();
      return data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  private async _getLatestNonce(): Promise<number> {
    let latestBlockNumber;
    try {
      latestBlockNumber = await Web3Provider.web3(this.params.nodeUrl).eth.getBlockNumber();
    } catch (err) {
      throw new Error('Could not access the provided node endpoint.');
    }
    try {
      await Web3Provider.contract(this.params.nodeUrl, this.params.contractAddress).methods.owner().call();
    } catch (err) {
      throw new Error('Could not find any cluster snapshot from the provided contract address.');
    }
    let step = this.MONTH;
    let latestNonce = 0;

    const genesisBlock = await Web3Provider.getGenesisBlock(this.params.nodeUrl, this.params.contractAddress);
    const ownerTopic = Web3Provider.web3().eth.abi.encodeParameter('address', this.params.ownerAddress);
    const filters = {
      fromBlock: genesisBlock,
      toBlock: latestBlockNumber,
      topics: [null, ownerTopic],
    };

    do {
      let result: any;
      try {
        result =
            (await Web3Provider.contract(this.params.nodeUrl, this.params.contractAddress).getPastEvents('AllEvents', filters))
                .filter((item: any) => this.eventsList.includes(item.event));
        latestNonce += result.length;
        filters.fromBlock = filters.toBlock + 1;
      } catch (e: any) {
        if (step === this.MONTH) {
          step = this.WEEK;
        } else if (step === this.WEEK) {
          step = this.DAY;
        } else {
          throw new Error(e);
        }
      }
      filters.toBlock = Math.min(filters.fromBlock + step, latestBlockNumber);
    } while (filters.toBlock - filters.fromBlock > 0);

    return latestNonce;
  }
}
