import express, {Express, Request, Response} from 'express';
import bodyParser from "body-parser";
import path from "path";
import {ssvValidatorLogger} from "../tool/logger";
import {checkIsDeposit} from "../tool/tools";
import {RegisterValidator, RemoveValidator} from "../Contract/SSVNetwork";
import {BEACON_NODE_URL, ExitRootPath, PendingPath} from "../config";
import {deleteFile, getAllFile, writeFile} from "../tool/file";
import {Eth2Client} from "./Eth2Client";
import {GlobalResponseBody} from "./ResponseBody/GlobalResponseBody";
import AsyncLock from 'async-lock';
import {getOperators, getValidatorsPerOperatorLimit} from "../Contract/SSVNetworkViews";

const lock = new AsyncLock();

const app: Express = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const router = express.Router()

//code: 200 success
//code: 400 error
//code:

router.use(function (req, res, next) {
    ssvValidatorLogger.log("URL:", req.originalUrl, 'start')

    const files = getAllFile(PendingPath)

    if (files.length > 0) {
        ssvValidatorLogger.log("There are pending transactions, please wait")
        return res.json(GlobalResponseBody.error('There are pending transactions, please wait'));
    } else {
        next()
    }
})

router.get('/getStatus', async (req: Request, res: Response) => {
    const number = await getOperators();
    const limit = await getValidatorsPerOperatorLimit();

    if (number >= limit) {
        ssvValidatorLogger.log("The number of cluster validators exceeds the upper limit!")
        return res.json(GlobalResponseBody.exceedsLimit());
    }

    const files = getAllFile(PendingPath)

    if (files.length > 0) {
        ssvValidatorLogger.log("There are pending transactions, please wait")
        return res.json(GlobalResponseBody.error('There are pending transactions, please wait'));
    } else {
        return res.json(GlobalResponseBody.success());
    }
});

router.post('/registryValidator', async (req: Request, res: Response) => {
    await lock.acquire('httpClient', async () => {
        const keystore = req.body['keystore'];
        if (!keystore) {
            return res.json({
                code: '400',
                data: '',
                msg: 'Keystore is required',
            })
        }
        const password = String(req.body['password'] || '');
        if (!password.length) {
            return res.json({
                code: '400',
                data: '',
                msg: 'Keystore password is required',
            })
        }

        const number = await getOperators();
        const limit = await getValidatorsPerOperatorLimit();

        if (number >= limit) {
            ssvValidatorLogger.log("The number of cluster validators exceeds the upper limit!")
            return res.json(GlobalResponseBody.exceedsLimit());
        }

        const publicKey = keystore.pubkey;
        const deposited = await checkIsDeposit(publicKey);
        if (!deposited) {
            return res.json({
                code: '400',
                data: '',
                msg: 'publicKey\'s status is not true',
            });
        }

        try {
            const result = await RegisterValidator(keystore, password);
            return res.json({
                code: '200',
                data: result,
                msg: 'success',
            });
        } catch (e) {
            ssvValidatorLogger.error('registryValidator', e)
            return res.json({
                code: '400',
                data: '',
                msg: e.message,
            });
        }
    })
});

router.post('/removeValidator', async (req: Request, res: Response) => {
    await lock.acquire('httpClient', async () => {
        console.log(req.body)

        const publicKey = String(req.body['publicKey'] || '');
        if (!publicKey.length) {
            return res
                .json(GlobalResponseBody.error('publicKey is required'));
        }

        try {
            const result = await RemoveValidator(publicKey);

            ssvValidatorLogger.error('removeValidator', result)

            return res.json(result);
        } catch (e) {
            ssvValidatorLogger.error('removeValidator', e)

            return res.json(GlobalResponseBody.error());
        }
    })
});
//https://api.infstones.com/ethereum/mainnet/36cd5685ce90461bad777a9ef1e948d0/beacon
//./ethdo validator exit --passphrase password --validator=./keystore-m_12381_3600_0_0_0-1665284093.json --connection=http://172.31.3.18:3500 --allow-insecure-connections
router.post('/exitValidator', async (req: Request, res: Response) => {
    await lock.acquire('httpClient_exit', async () => {
        const keystore = req.body['keystore'];
        if (!keystore) {
            return res
                .json({
                    code: '400',
                    data: '',
                    msg: 'Keystore is required'
                });
        }
        const password = String(req.body['password'] || '');
        if (!password.length) {
            return res
                .json({
                    code: '400',
                    data: '',
                    msg: 'Keystore password is required'
                });
        }

        const filePath = path.join(ExitRootPath, 'keystore', `${keystore.pubkey}.json`)

        try {
            writeFile(filePath, JSON.stringify(keystore));

            //https://api.infstones.com/ethereum/mainnet/36cd5685ce90461bad777a9ef1e948d0
            //https://api.chainup.net/ethereum2/goerli/f13908a852f641d4bcfdd342e8f2622d
            //https://api.chainup.net/ethereum2-archive/goerli
            //https://delicate-powerful-hill.ethereum-goerli.discover.quiknode.pro/d5052e526a758e93ba97339fa23f094119badd1a
            const ethClient = new Eth2Client(BEACON_NODE_URL)
            const result = await ethClient.exitValidator(keystore, password);
            return res.json({
                code: '200',
                data: result,
                msg: 'success',
            });
        } catch (e) {
            ssvValidatorLogger.error('exitValidator', e)

            return res.json({
                code: '400',
                data: '',
                msg: e.message,
            });
        } finally {
            deleteFile(filePath)
        }
    })
});

app.use('/ssv', router)

export {
    app as SSVAPP
}
