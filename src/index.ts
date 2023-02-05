import { ChatGPTAPI } from 'chatgpt'
import child_process  from 'child_process'
import * as robot from 'robotjs'
import * as fs from 'fs';
import * as os from 'os';
// import * as  keySender from "node-key-sender"
const preprompt = `You are now playing the role of a command-line instruction translation tool, I will input Linux system supported instructions, and you translate them into the corresponding PowerShell instructions. 
For example, if I input ls, you answer dir. Your answer only needs to contain the translated instruction itself.`

class ConfigHandler {
  private configFilePath: string;
  private store: { apiKey: string };

  constructor() {
    this.configFilePath = `${os.homedir()}/.psgpt`;
    if (fs.existsSync(this.configFilePath)) {
      this.store = JSON.parse(fs.readFileSync(this.configFilePath).toString());
    } else {
      console.log(`api key need to init in ${this.configFilePath}`)
      this.store = { apiKey: '' };
      fs.writeFileSync(this.configFilePath, JSON.stringify(this.store));
    }
  }

  setApiKey(apiKey: string): void {
    this.store.apiKey = apiKey;
    fs.writeFileSync(this.configFilePath, JSON.stringify(this.store));
  }

  getApiKey(): string {
    return this.store.apiKey;
  }
}

async function main() {
  const configHandler = new ConfigHandler();
  const api = new ChatGPTAPI({
    apiKey: configHandler.getApiKey(),
  })
  const args = process.argv.slice(2)
  let execute_cmd = "";
  for (let i = 0; i < args.length; i++) {
    execute_cmd += args[i] + " ";
  }
  execute_cmd = execute_cmd.trim();

  let res = await api.sendMessage(execute_cmd, {
    promptPrefix: preprompt
  })
  console.log(res.text)
  robot.typeString(res.text)

}

main()