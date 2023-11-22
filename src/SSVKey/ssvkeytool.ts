import {CLUSTER_OWENER_ADDRESS, ExistedPath, GETH_NODE_URL, operatorIds, operatorPubs, SSV_ADDRESS} from "../config";
import {ClusterScanner} from "./SSVScanner/ClusterScanner";
import {exists} from "../tool/file";
import path from "path";
import {KeyShares, SSVKeys} from "ssv-keys";
import {NonceScanner} from "./SSVScanner/NonceScanner";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const ssvKeys = new SSVKeys();

// let clusterSnapshot: null | any = null;

export const generateKeyshare = async (keystore: any, password: string): Promise<any> => {
  const nounce = await generateLastNonce();

  const {publicKey, privateKey} = await ssvKeys.extractKeys(keystore, password);

  const operators = operatorPubs.map((operatorKey: string, index: number) => ({
    id: operatorIds[index],
    operatorKey,
  }));

  // Build final web3 transaction payload and update keyshares file with payload data
  const keyShares = new KeyShares();

  keyShares.update({ownerAddress: CLUSTER_OWENER_ADDRESS, ownerNonce: nounce, operators, publicKey});

  const encryptedShares = await ssvKeys.buildShares(privateKey, operators);

  const payload = await keyShares.buildPayload({
    publicKey,
    operators,
    encryptedShares
  }, {
    ownerAddress: CLUSTER_OWENER_ADDRESS,
    ownerNonce: nounce,
    privateKey
  });

  return payload.sharesData;
}

export const generateClusterSnapshot = async () => {
  const params = {
    nodeUrl: GETH_NODE_URL,
    contractAddress: SSV_ADDRESS,
    ownerAddress: CLUSTER_OWENER_ADDRESS,
    operatorIds
  }

  // if (clusterSnapshot !== null){
  //     return clusterSnapshot;
  // }

  const command = new ClusterScanner(params);
  const clusterObject = await command.run(operatorIds)

  // clusterSnapshot = clusterObject.cluster

  return clusterObject.cluster;
}

const generateLastNonce = async () => {
  const params = {
    nodeUrl: GETH_NODE_URL,
    contractAddress: SSV_ADDRESS,
    ownerAddress: CLUSTER_OWENER_ADDRESS,
    operatorIds
  }
  const command = new NonceScanner(params);
  const nonce = await command.run();

  return nonce;
}

// export const resetClusterSnapshot = () => {
//     clusterSnapshot = null;
// }

//检查是否已上次
export const alreadyRegister = async (publicKey: string) => {
  return exists(path.join(ExistedPath, publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`));
}
