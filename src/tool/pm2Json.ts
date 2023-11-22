interface pm2startJson {
  "apps": [
    {
      "name": string,
      "script": string,
      "args": string,
      "instances": number,
      "exec_mode": string,
      "autorestart": boolean
    }
  ]
}

const initValidatorServerJson = (input: string) => {
  const pm2startJson: pm2startJson = {
    "apps": [
      {
        "name": "ssvHttp-server",
        "script": 'dist/ValidatorServer.js',
        "args": `--ciphertext ${input}`,
        "instances": 1,
        "exec_mode": "fork",
        "autorestart": true
      }
    ]
  }

  return pm2startJson
}

export {
  initValidatorServerJson
}
