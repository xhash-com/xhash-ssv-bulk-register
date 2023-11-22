import {getPrivateKey, MAXGasPrice, setCiphertext, SSV_ADDRESS} from "./config";
import {program} from "commander";
import {getGasOracle} from "./tool/tools";
import Web3 from "web3";
import {getWeb3Instanse, sendSignedTransaction} from "./Contract/Contract";

program
    .version("1.0.0")
    .option('-c, --ciphertext <ciphertext>', 'input for ciphertext')
    .option('-t, --tx <tx>', 'input for tx')
    .parse(process.argv)

const exec = async (ciphertext: string) => {
  setCiphertext(ciphertext)
  const tx = await getWeb3Instanse().eth.getTransaction(program.opts()['tx'])
  console.log('createTrancation tx: ', tx)
  console.log('createTrancation getGas start');
  const gasOracle = await getGasOracle();
  const web3GasPrice = Web3.utils.fromWei(await getWeb3Instanse().eth.getGasPrice(), 'gwei');
  let gasPrice = Number((Number(gasOracle?.result?.SafeGasPrice || web3GasPrice) * 1.2).toFixed(2));
  gasPrice = Math.min(gasPrice, MAXGasPrice);
  console.log('createTrancation gasPrice: ', gasOracle);
  const newTx = await getWeb3Instanse().eth.accounts.signTransaction(
      {
        to: SSV_ADDRESS,
        data: tx.input,
        gas: tx.gas,
        gasPrice: Web3.utils.toWei(String(gasPrice), 'gwei'),
        nonce: tx.nonce
      },
      getPrivateKey()
  );

  const result = await sendSignedTransaction(newTx, () => {
    console.info('RegisterValidator: send transaction end', newTx.transactionHash)
  });

  if (!result) {
    throw new Error('register failed')
  }
}

exec(program.opts()['ciphertext'])
