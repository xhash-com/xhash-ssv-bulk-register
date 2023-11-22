import {alreadyRegister} from "../SSVKey/ssvkeytool";
import {promisify} from "util";
import {execFile} from "child_process";
import path from "path";
import {ExitRootPath} from "../config";
import {ssvValidatorLogger} from "../tool/logger";

const execFileProm = promisify(execFile);

export class Eth2Client {
  endPoint: string

  constructor(endPoint: string) {
    this.endPoint = endPoint
  }

  exitValidator = async (keystore: any, password: string) => {
    //检查是否已注册
    if (!await alreadyRegister(keystore.pubkey)) {
      throw new Error('never register');
    }

    try {
      //'--allow-insecure-connections'
      const args: string[] = ['validator', 'exit', '--passphrase', `${password}`, `--validator=${path.join(ExitRootPath, 'keystore', `${keystore.pubkey}.json`)}`, `--connection=${this.endPoint}`, '--allow-insecure-connections'];

      //ethdo
      const result = await execFileProm(path.join(ExitRootPath, 'ethdo'), args);
      if (result.stderr) {
        throw new Error(result.stderr)
      }
    } catch (e) {
      ssvValidatorLogger.error(e)
      throw new Error(e.message)
    }
  }
}
