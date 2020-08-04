'use strict';
/** 
 * @author github.com/tintinweb
 * @license MIT
 * 
* */
const vscode = require('vscode');
const {InteractiveWebviewGenerator} = require('./interactiveWebview.js');
const settings = require('../../settings');

var semver = require('semver');

const SKIP_VERSIONS = {
    "0.0.25":function(lastSeenVersion){                         //extensionversion is 0.0.25
        return semver.satisfies(lastSeenVersion, ">=0.0.24");    //skip if last seen version was 0.0.24 or greater
    },
    "0.0.29":function(lastSeenVersion){                         //extensionversion is 0.0.29
        return semver.satisfies(lastSeenVersion, ">=0.0.28");    //skip if last seen version was 0.0.28 or greater
    }
};

const MESSAGE = `[<img width="130" alt="get in touch with Consensys Diligence" src="https://user-images.githubusercontent.com/2865694/56826101-91dcf380-685b-11e9-937c-af49c2510aa0.png">](https://diligence.consensys.net)<br/>
<sup>
[[  🌐  ](https://diligence.consensys.net)  [  📩  ](mailto:diligence@consensys.net)  [  🔥  ](https://consensys.github.io/diligence/)]
</sup><br/><br/>



Thanks for using **Solidity Visual Developer** 🤜🤛

### What's New?

The complete changelog can be found [here](https://github.com/ConsenSys/vscode-solidity-auditor/blob/master/CHANGELOG.md). 

#### v0.0.29
- sort top level contracts list by filename
- fix: VSCode-Error: Proposed API is only available when running out of dev or with the following command line switch... #59

#### v0.0.28
- new: integration with [tintinweb.vscode-ethover](https://marketplace.visualstudio.com/items?itemName=tintinweb.vscode-ethover) (uninstall to disable)
    - ethereum address hover
    - open address in etherscan, fetch bytecode, verified contract
    - disassemble or decompile bytecode
    - registers \`.evmtrace\` and \`.evm\` language handlers to decorate disassemblies or bytecode
    - customizations/ApiKey: see settings

<img width="360" alt="image" src="https://user-images.githubusercontent.com/2865694/86650152-bd707780-bfe2-11ea-819d-a9e3dacb2034.gif">
- update: \`surya\` to \`0.4.1-dev.2\`

<sub>
Note: This notification is only shown once per release. Disable future notification? \`settings → solidity-va.whatsNew.disabled : true\`
</sub>
___
<sub>
Thinking about smart contract security? We can provide training, ongoing advice, and smart contract auditing. [Contact us](https://diligence.consensys.net/contact/).
</sub>
`;


class WhatsNewHandler {

    async show(context){

        let extensionVersion = settings.extension().packageJSON.version;
        let config = settings.extensionConfig();

        let lastSeenVersion = context.globalState.get("solidity-va.whatsNew.lastSeenVersion");
        if(config.whatsNew.disabled){ 
            return;
        }

        if(lastSeenVersion){
            // what's new msg seen before
            if(semver.satisfies(lastSeenVersion, ">=" + extensionVersion)){
                // msg seen
                console.log(">=" + extensionVersion);
                return;
            }

             //skip if previous version what's new has been seen
            let check_skip_fn = SKIP_VERSIONS[extensionVersion];
            if(check_skip_fn && check_skip_fn(lastSeenVersion)){
                console.log("Skipping what's new for:" +extensionVersion);
                return;
            }
        }

        await this.showMessage(context);
    }

    async showMessage(context) {
        let doc = {
            uri:"unknown",
        };


        let webview = new InteractiveWebviewGenerator(context, "whats_new");
        webview.revealOrCreatePreview(vscode.ViewColumn.Beside, doc)
            .then(webpanel => {
                webpanel.getPanel().postMessage({
                    command:"render", 
                    value:{
                        markdown:MESSAGE,
                    }
                });
            });
        
        context.globalState.update("solidity-va.whatsNew.lastSeenVersion", settings.extension().packageJSON.version);
    }
}

module.exports = {
    WhatsNewHandler:WhatsNewHandler
};