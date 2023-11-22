import {Encrypt} from "./tool/rsa";
import prompt from 'prompt';
import {writeFile} from "./tool/file";
import path from "path";
import {cwd} from "process";
import {initValidatorServerJson} from "./tool/pm2Json";

interface Schema {
  [key: string]: {
    properties: {
      [key: string]: {
        hidden: boolean;
      };
    };
  };
}

const schema: Schema = {
  'privateKey': {
    properties: {
      privateKey: {
        hidden: true
      }
    }
  }
};

const exec = async () => {
  const result = await prompt.get(schema['privateKey']);
  if (result && typeof result['privateKey'] === 'string') {
    const input = String(result['privateKey'])

    const encryptData = Encrypt(input)

    const ValidatorServerJson = initValidatorServerJson(encryptData)

    writeFile(path.join(cwd(), 'ValidatorHttp.json'), JSON.stringify(ValidatorServerJson))

    console.log('初始化validaroeHttp.json成功')
  } else {
    console.log('input is error')
  }
}

exec()

