import {getContract} from "./Contract";
import {CLUSTER_OWENER_ADDRESS, operatorIds, SSV_VIEW_ADDRESS, SSVViews_ABI} from "../config";
import {generateClusterSnapshot} from "../SSVKey/ssvkeytool";
import {Contract} from "web3-eth-contract";
import {allowance, increaseAllowance} from "./SSVToken";
import Web3 from "web3";

let ssvnetworkviws: Contract | null = null;
const SSVNetworkViews = async (): Promise<Contract> => {
  if (ssvnetworkviws) {
    return ssvnetworkviws;
  }
  ssvnetworkviws = await getContract(SSVViews_ABI, SSV_VIEW_ADDRESS);
  return ssvnetworkviws;
}

const getBalance = async (): Promise<string> => {
  const owner = CLUSTER_OWENER_ADDRESS;
  const cluster = await generateClusterSnapshot();

  const ssvViews = await SSVNetworkViews();
  return await ssvViews.methods.getBalance(owner, operatorIds, cluster).call();
}

const getOperatorFee = async (): Promise<string[]> => {
  const ssvViews = await SSVNetworkViews();
  const operatorFee = [];
  for (let i = 0; i < operatorIds.length; i++) {
    const item = await ssvViews.methods.getOperatorFee(operatorIds[i]).call()
    operatorFee.push(item);
  }

  return operatorFee;
}

const getBurnRate = async (): Promise<string> => {
  const owenr = CLUSTER_OWENER_ADDRESS;
  const cluster = await generateClusterSnapshot();
  const ssvViews = await SSVNetworkViews();
  return await ssvViews.methods.getBurnRate(owenr, operatorIds, cluster).call();
}

const getLiquidationThresholdPeriod = async (): Promise<string> => {
  const ssvViews = await SSVNetworkViews();
  return await ssvViews.methods.getLiquidationThresholdPeriod().call();
}

const getNetworkFee = async (): Promise<string> => {
  const ssvViews = await SSVNetworkViews();
  return await ssvViews.methods.getNetworkFee().call();
}

const getTotalFee = async (day: number = 365, pre: boolean = true) => {
  const operatoesFee = await getOperatorFee()

  let operatorFee = 0;
  for (let i = 0; i < operatoesFee.length; i++) {
    operatorFee += Number(operatoesFee[i]);
  }
  const networkFee = Number(await getNetworkFee())

  const burnRate = pre ? operatorFee + networkFee : Number(await getBurnRate())

  const liquidationThresholdPeriod = Number(await getLiquidationThresholdPeriod())

  return burnRate * (7200 * day + liquidationThresholdPeriod);
}

const getValidator = async (ownerAddress: string, publicKey: string) => {
  const ssvViews = await SSVNetworkViews();

  return await ssvViews.methods.getValidator(publicKey).call();
}

const OperatorRunway = async (newOperator: boolean = false): Promise<number> => {
  const balance: number = Number(await getBalance());

  const liquidationThresholdPeriod: number = Number(await getLiquidationThresholdPeriod());

  const operatoesFee: string[] = await getOperatorFee()

  const operatorFee: number = operatoesFee.reduce((a, b) => a + Number(b), 0);

  const networkFee: number = Number(await getNetworkFee())
  const burnRate = Number(await getBurnRate()) + (newOperator ? operatorFee + networkFee : 0)
  return (balance - burnRate * liquidationThresholdPeriod) / (burnRate * 7200);
}

const getOperators = async (): Promise<Number> => {
  const ssvViews = await SSVNetworkViews();
  let maxNumber = 0;

  for (let i = 0; i < operatorIds.length; i++) {
    const operator = await ssvViews.methods.getOperatorById(operatorIds[i]).call();
    maxNumber = Math.max(maxNumber, Number(operator[2]));
  }

  return maxNumber;
}

const getValidatorsPerOperatorLimit = async (): Promise<Number> => {
  const ssvViews = await SSVNetworkViews();
  return await ssvViews.methods.getValidatorsPerOperatorLimit().call();
}

const getTotalFeeAndAprove = async (day: number = 365) => {
  const totalFee = await getTotalFee(day);

  //查看aprove的额度是否大于totalFee
  //如果小于，需要aprove
  const allow = await allowance();
  if (!Web3.utils.toBN(allow).gte(Web3.utils.toBN(totalFee))) {
    await increaseAllowance(totalFee.toString());
  }

  return totalFee;
}

export {
  getTotalFeeAndAprove,
  getBalance,
  getValidator,
  getNetworkFee,
  getTotalFee,
  OperatorRunway,
  getOperatorFee,
  getOperators,
  getValidatorsPerOperatorLimit
}
