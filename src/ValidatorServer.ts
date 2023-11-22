import {PORT, setCiphertext} from "./config";
import {SSVAPP} from "./Client/HttpClient";
import {program} from "commander";
import {ssvValidatorLogger} from "./tool/logger";

program
    .version("1.0.0")
    .option('-c, --ciphertext <ciphertext>', 'input for ciphertext')
    .parse(process.argv)

const exec = (ciphertext: string) => {
    setCiphertext(ciphertext)
    SSVAPP.listen(PORT, () => {
        ssvValidatorLogger.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
    });
}

exec(program.opts()['ciphertext'])
