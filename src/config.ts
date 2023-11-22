import path from "path";
import {cwd} from "process";
import {Decrypt} from "./tool/rsa";
import {ssv_abi} from "./abi/ssv_abi";
import {ssvviews_abi} from "./abi/ssvviews_abi";
import {ssvtoken_abi} from "./abi/ssvtoken_abi";

const SSV_ABI = ssv_abi
const SSVViews_ABI = ssvviews_abi
const SSVToken_ABI = ssvtoken_abi
const DataRoot = path.join(cwd(), 'data');
const ExitRootPath = path.join(DataRoot, 'exit');
const ExistedPath = path.join(DataRoot, 'existed');
const PendingPath = path.join(DataRoot, 'pending');
let SSV_OWNER_PRIVATEKEY_CIPHERTEXT = ''
const setCiphertext = (ciphertext: string) => {
    SSV_OWNER_PRIVATEKEY_CIPHERTEXT = ciphertext
}

const getCiphertext = () => SSV_OWNER_PRIVATEKEY_CIPHERTEXT
const getPrivateKey = () => Decrypt(getCiphertext())

const SSV_ADDRESS = '0xC3CD9A0aE89Fff83b71b58b6512D43F8a41f363D'
const SSV_TOKEN_ADDRESS = '0x3a9f01091C446bdE031E39ea8354647AFef091E7'
const SSV_VIEW_ADDRESS = '0xAE2C84c48272F5a1746150ef333D5E5B51F68763'


const CLUSTER_OWENER_ADDRESS = '0xFE-----------------------------------'
//SSV CONTRACT ADDRESS Genesis Block
const GenesisBlock = 9203578

const EtherscanKey = 'CF-----------------------'
const EtherscanApi = 'https://api.etherscan.io/api'

const MAXGasPrice = 50

const operatorIds = [100, 101, 102, 103];
const operatorPubs = [
    "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdUZoTnI0WC9hd1ppNWd6RlZTK28KRjczdU9FNmU1WkNabmNoWjVXakszQzdYb3lBVlZhdzNOYnFSbHFOZTE5SDQxM3ZkcCtybVA5dzlJc0txOTdzVQpuUzBrdnZqZmxlNWVuSEg3a3V4UjdtbE1lVTVaNE02RXl6ZjVGWkw5eHdpLzFvUnJ1ZWhYM3dPRmtuWjhBZS93CmVZRk9QK2ZCWjEwc3lGam1vNW55SHF4SGNiLzVNUmkvYUFXeUhsN2tDWmxJbTdkY3lSdW5MT3dkZjRIVmZuKzgKZFpuRjZDaUQ5Z2lvdlNnN3pHWU9lMFNxUjJMekR6bCtzL1Jmbk9YMEZxL25GUldremJ3WDZOcjFMUVBDNmUvWQpvWXA1QnMrdHZ6RXpHT3NPZDNNaUFPOElkODhkZ2lPVlQ3OUlBUHVyaW9ERnU0MlY3ZzNQRk9POWtpL1BUZ1lNCkJRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
    "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBa2QrTVBxclRtVitWaUdDNUdxelgKM3Vkd1JZVExoNHg1UjNqWjNPZVUvZnFnQytqWlpCOWNvYzVZYU1rM05rM2hHTnFLMlc4WGRsTUJ6QXFUd2ZJbwp0YndsRzZqeFFQRlJBc1dlbzBJMEZCaVNJdEd6NjczRW5RQnpnQXhNeGZRd25ZQTU3TWRLek1JYzQ2VVp1ekNQCnhpZGxtQ0NqUXIvMDNRNyt4TDNLWWg3VTArcFVlMkhOcVNBem9tdEM3N0YvT0ZvUytieFgzdGIzcVUxak5DQTIKRmJEK21pTC9KVHhaNnZvcC8xckg2b25NTW9WKzNkTmNEdkIzc2NWNDVkd0NWaS9XbzBTYjJjM1NkL2pYcGJvKwovWW1iN1BCSm9Pakl3MHhsSnEyWWFJMFZnaTMzR3FmWm1EUkZFQ1NQRHZVczE4S1BGMnN6ZSt4ZEZYd3ZzeFJzCk1RSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
    "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBbm1LbjF3OHowMFVObVpQV0g3N1QKVzFsM2NCdi9PMElSVjNoWVpTdlFySFNPcjhGOXduWXZuZVJRb0VZU3VMeTluNXo1WWhPT0xpTFJxTU81UWYycgowRVFDKytpcU9wNFBVc3hVTHZLR0JVbzY3Vi9sV0JreWx4cVE2ZkxyU2FobEF4c2JIcGJSZDJ0MU5GQmtxRjJQCmpuR3llSkJGTjVGbzV0SjJXZ3ZQUHlmVUJrTWQzYUpESS9uVy8xcGtETXV6MGNvam9MVGpucDlqMmF2T2RMb1gKOWxSZ3RXcDhvWjljTmdpM0pXMWIwWnFrdUpUWmhHN09wMGQrU01aVFBEcmcvOWlzSzFBTUVXbm45UTU3clBoTAp3RDFaUTFYWUJydi9NOWtDTk9CNzVhRkN4RE5rS0ZKZEZrVEFaRDFvRnlNaGF1Wkt1RkNtZTVIK3E2WnNzb21pCjlRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K",
    "LS0tLS1CRUdJTiBSU0EgUFVCTElDIEtFWS0tLS0tCk1JSUJJakFOQmdrcWhraUc5dzBCQVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdnJRb2MxTDNZcEZaM3NDdzJzdFUKS29OakZIOXhOQjROeTRTanA4U0dvR25NRkliS0txcTRvTTZKWjdoWUJMWjZjNWRBTnIvdit6SDU0cEp2WGxqRQpXUHVTdWhObStaOUV1aTd1SzlRNmRqOUlUUHFHc1JIUnYyYjNBYzNhRThmRTA2OTRBZnhJMDZxWlI1MzJ0ZjAxCnRtZ3U2K0k5UWs4ZlF6cTZyTmFwRGE0WTNLVHRhVzFEMzhUUmZFdG1MUDQwQlVGTkZZQTBrejk5dG1CR25wcW8KdG5nOFVaMHBuU0JsSWhBUXZCVEJEMHdUZFZrSmFDc2YyaitrVVZkUU5wancvQ29HSzE1NmZLZEI4VGZqRWRNbgp6SnBnTVcxVVNyZG5KcDhNWHhOSkJjOGtudWwxc3RmWExPS2MvSi9mZEJCdWExT2Z3N3k2Y2RGSFhvWFhNMmN3CjhRSURBUUFCCi0tLS0tRU5EIFJTQSBQVUJMSUMgS0VZLS0tLS0K"
];
//telegram bot token
const TelegramToken = '5547865801:AAE----------------------'
//telegram group chat id
const chat_id = '-123456789101112'
const PORT = 3008
//geth node endpoint
const GETH_NODE_URL = 'http://192.168.1.1:8035'
//beacon node endpoint
const BEACON_NODE_URL = 'http://192.168.1.1:5052'
//explorer node endpoint
const ExplorerUrl = 'http://192.168.1.1:3338'

const GenesisTimestamp = 1616508000

export {
    operatorIds,
    operatorPubs,
    SSV_ABI,
    SSVViews_ABI,
    PORT,
    GETH_NODE_URL,
    BEACON_NODE_URL,
    SSV_ADDRESS,
    SSV_TOKEN_ADDRESS,
    SSV_VIEW_ADDRESS,
    SSVToken_ABI,
    CLUSTER_OWENER_ADDRESS,
    TelegramToken,
    chat_id,
    ExitRootPath,
    ExplorerUrl,
    GenesisTimestamp,
    ExistedPath,
    GenesisBlock,
    setCiphertext,
    getCiphertext,
    getPrivateKey,
    PendingPath,
    EtherscanKey,
    EtherscanApi,
    MAXGasPrice
}
