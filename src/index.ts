import { ChatGPTAPI } from 'chatgpt'
import { exec } from 'child_process'
import * as iconv from 'iconv-lite'
const preprompt = 'You are now playing the role of a command-line instruction translation tool, I will input Linux system supported instructions, and you translate them into the corresponding PowerShell instructions. For example, if I input ls, you answer dir. Your answer only needs to contain the translated instruction itself.'

function decodecheck(text: string, codetype: string = '') {
  if (codetype != "") {
    text = iconv.decode(Buffer.from(text), codetype);
  }
  return text;
}
// const command = process.argv[2];
async function main() {
  const api = new ChatGPTAPI({
    apiKey: ""
  })
  const encoding = process.env.GPTLOGENV || '';
  // console.log('encoding', encoding)
  const args = process.argv.slice(2)
  let execute_cmd = "";
  for (let i = 0; i < args.length; i++) {
    execute_cmd += args[i] + " ";
  }
  execute_cmd = execute_cmd.trim();
  if (args[0] == 'cd') {
    console.error("cd is not supported, pls use cd in powershell directly.")
  } else {
    // console.log(execute_cmd)
    let res = await api.sendMessage(execute_cmd, {
      promptPrefix: preprompt
    })
    exec(res.text, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${decodecheck(error.toString(), encoding)}`);
        return;
      }
      console.log(decodecheck(stdout, encoding));
      console.error(decodecheck(stderr, encoding));
    });
  }


}

main()