# xhash-ssv-bulk-register

A tool help to create 4 keyshares from validator's keystore and call ssv's smart contract to register.

## install nvm

```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

## install node

```
nvm install v18.12.1
nvm use 18.12.1
```

## install pm2

```
npm install -g pm2
```

# install javascript-obfuscator

```
npm install -g javascript-obfuscator
```

## deploy

```
0、Check and edit src/config.ts
1、Cryptographic private key
    1、openssl genrsa -out private.pem 1024
    2、openssl rsa -in private.pem -pubout -out public.pem
    3、npm install
    4、npm run build
    5、node ./dist/keygen.js
2、start
    1、pm2 start validatorHttp.json
3、Set the system to start automatically
    1、pm2 startup
    2、pm2 save
```

## Call script

```
1、register validator
    curl -XPOST "http://127.0.0.1:3008/ssv/registryValidator" -H "Content-Type:application/json" -d "{\"keystore\":
    {keystore},\"password\":\"password\"}"
2、remove validator
    curl -XPOST "http://127.0.0.1:3008/ssv/removeValidator" -H "Content-Type:application/json" -d "{\"publicKey\": \"\"}"
3、exit validator
    curl -XPOST "http://127.0.0.1:3008/ssv/exitValidator" -H "Content-Type:application/json" -d "{\"keystore\":{keystore},\"
    password\":\"password\"}"
```
