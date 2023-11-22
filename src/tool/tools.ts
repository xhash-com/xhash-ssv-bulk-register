import axios from 'axios';
import {EtherscanApi, EtherscanKey, ExplorerUrl, GenesisTimestamp} from "../config";
import {ssvValidatorLogger} from "./logger";

const epoch = () => {
    return Math.floor((Date.now() / 1000 - GenesisTimestamp) / 384)
}


const pre0x = (str: string) => {
    return str.startsWith('0x') ? str : '0x' + str;
}

//deposited

const checkIsDeposit = async (publick: string) => {
    try {
        const uri = `${ExplorerUrl}/xhash/v1/validator/${pre0x(publick)}/attestations/${epoch()}`
        const {data: result} = await axios.get(uri)
        return !(!result.data || !result.data.index || result.data.status === 'exited');
    } catch (e) {
        ssvValidatorLogger.error('checkIsDeposit', e)
        return false;
    }
}

const getGasOracle = async () => {
    try {
        const uri = `${EtherscanApi}?module=gastracker&action=gasoracle&apikey=${EtherscanKey}`
        const {data: result} = await axios.get(uri)
        return result;
    } catch (e) {
        ssvValidatorLogger.error('getGasOracle', e)
        return null;
    }
}

export {
    pre0x,
    checkIsDeposit,
    getGasOracle
}
