import {createTrancation, getContract, getContractMethod, sendSignedTransaction} from "./Contract";
import {alreadyRegister, generateClusterSnapshot, generateKeyshare} from "../SSVKey/ssvkeytool";
import {CLUSTER_OWENER_ADDRESS, ExistedPath, getPrivateKey, operatorIds, SSV_ABI, SSV_ADDRESS} from "../config";
import {getBalance, getTotalFeeAndAprove, OperatorRunway} from "./SSVNetworkViews";
import {Contract} from "web3-eth-contract";
import {NoticeWarning} from "../tool/telegram";
import {pre0x} from "../tool/tools";
import {ssvValidatorLogger} from "../tool/logger";
import {GlobalResponseBody} from "../Client/ResponseBody/GlobalResponseBody";
import {web3} from "ssv-keys/dist/tsc/src/lib/helpers/web3.helper";
import {deleteFile, writeFile} from "../tool/file";
import path from "path";

let ssvnetwork: Contract | null = null;
const SSVNetwork = async (): Promise<Contract> => {
  if (ssvnetwork) {
    return ssvnetwork;
  }
  const options = {from: CLUSTER_OWENER_ADDRESS}
  ssvnetwork = await getContract(SSV_ABI, SSV_ADDRESS, options);
  return ssvnetwork;
}

//检查是否已注册
//判断是否费率是否足够
const RegisterValidator = async (keystore: any, password: string) => {
  //检查是否已注册
  ssvValidatorLogger.info('alreadyRegister check: ', keystore.pubkey)
  if (await alreadyRegister(keystore.pubkey)) {
    throw new Error('already register');
  }

  ssvValidatorLogger.info('alreadyRegister check: pass')
  const or = await OperatorRunway(true);

  if (or < 15) {
    const balance = await getBalance();
    ssvValidatorLogger.error(`operator runway not enough, balance: ${balance}, runway: ${or}`)
    await NoticeWarning(`operator runway not enough, balance: ${balance}, runway: ${or}`);
  }

  ssvValidatorLogger.info('Balance check: pass')
  const ssv = await SSVNetwork()
  const publicKey = pre0x(keystore.pubkey);
  const shareKeys = await generateKeyshare(keystore, password);

  ssvValidatorLogger.info('shareKeys: ', shareKeys)
  //ssv代币由手动控制, 不在这里进行任何操作
  //const amount = await getTotalFeeAndAprove(180);
  const amount: number = 0;
  const cluster = await generateClusterSnapshot();

  ssvValidatorLogger.info('RegisterValidator: ', 'getContractMethod')
  const registerValidator = getContractMethod(
      ssv,
      'registerValidator(bytes,uint64[],bytes,uint256,(uint32,uint64,uint64,bool,uint256))',
      [publicKey, operatorIds, shareKeys, String(amount), cluster]
  )
  ssvValidatorLogger.info('RegisterValidator: ', 'createTrancation')
  const tx = await createTrancation(SSV_ADDRESS, registerValidator, getPrivateKey());
  if (tx.transactionHash) {
    const result = await sendSignedTransaction(tx, () => {
      ssvValidatorLogger.info('RegisterValidator: send transaction end', tx.transactionHash)
      writeFile(path.join(ExistedPath, publicKey), publicKey)
      // resetClusterSnapshot();
    });

    if (!result) {
      throw new Error('register failed')
    }

    return tx.transactionHash;
  }

  throw new Error('register failed')
}

const RemoveValidator = async (publicKey: string) => {
  //检查是否已注册
  if (!(await alreadyRegister(publicKey))) {
    return GlobalResponseBody.neverRegister();
  }

  publicKey = pre0x(publicKey);
  const ssv = await SSVNetwork();
  const cluster = await generateClusterSnapshot();
  const registerValidator = getContractMethod(
      ssv,
      'removeValidator(bytes,uint64[],(uint32,uint64,uint64,bool,uint256))',
      [publicKey, operatorIds, cluster]
  )
  const tx = await createTrancation(SSV_ADDRESS, registerValidator, getPrivateKey());
  if (tx.transactionHash) {
    ssvValidatorLogger.info('RemoveValidator: send transaction start', tx.transactionHash)
    const result = await sendSignedTransaction(tx, () => {
      ssvValidatorLogger.info('RemoveValidator: send transaction end', tx.transactionHash)
      deleteFile(path.join(ExistedPath, publicKey))
      //resetClusterSnapshot();
    });

    if (!result) {
      return GlobalResponseBody.error('remove failed');
    }

    return GlobalResponseBody.success(tx.transactionHash);
  }

  return GlobalResponseBody.error('remove failed');
}


//dont do
const Deposit = async (day: number = 30) => {
  const owner = CLUSTER_OWENER_ADDRESS;
  const amount = await getTotalFeeAndAprove(day);
  const cluster = await generateClusterSnapshot();
  const deposit = getContractMethod(
      await SSVNetwork(),
      'deposit[address, uint64[], uint256, tuple]',
      [owner, operatorIds, amount, cluster]
  )
  const tx = await createTrancation(SSV_ADDRESS, deposit, getPrivateKey());
  if (tx.transactionHash) {
    return await sendSignedTransaction(tx);
  }
}

const validatorPKs = async (publicKey: string) => {
  const input = web3.utils.soliditySha3(pre0x(publicKey))

  const SSVNetworkContract = await SSVNetwork()

  return await SSVNetworkContract.methods.validatorPKs(input).call();
}

const clusters = async (hashedCluster: string) => {
  const SSVNetworkContract = await SSVNetwork()

  return await SSVNetworkContract.methods.clusters(hashedCluster).call();
}

export {
  Deposit,
  RegisterValidator,
  RemoveValidator,
  validatorPKs,
  clusters
}
