import {getBalance, OperatorRunway} from "./Contract/SSVNetworkViews";
import {NoticeWarning} from "./tool/telegram";
import {ssvBalanceLogger} from "./tool/logger";

const schedule = require('node-schedule');

const exec = () => {
    SSVBalanceSchedule('30 0/30 * * * *')
}

const SSVBalanceSchedule = (cron: string) => {
    // 半个小时执行一次
    return schedule.scheduleJob(cron, () => {
        handleSSVBalance().then((result) => {

        }).catch((e) => {
            ssvBalanceLogger.error("SSVBalance error", e)
        })
    });
}

const handleSSVBalance = async () => {
    const or = await OperatorRunway();
    ssvBalanceLogger.info('Balance check: ', or)
    if (or < 30) {
        const balance = await getBalance();
        await NoticeWarning(`operator runway not enough, balance: ${balance}, runway: ${or}`);
    }
}

exec()
