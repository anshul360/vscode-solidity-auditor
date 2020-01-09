/** 
 * @author github.com/tintinweb
 * @license MIT
 * 
 * 
 * */

const vscode = require('vscode');

function generateUnittestStubForContract(document, g_parser, contractName){
    let contract = {
        name: contractName,
        path: document.uri.fsPath
    }

    if(!contractName){
        //take first
        let sourceUnit = g_parser.sourceUnits[document.uri.fsPath]
        if(!sourceUnit || Object.keys(sourceUnit.contracts).length<=0){
            vscode.window.showErrorMessage(`[Solidity VA] unable to create unittest stub for current contract. missing analysis for source-unit: ${active.document.uri.fsPath}`)
            return
        }

        contract.name = Object.keys(sourceUnit.contracts)[0]
    }
    
    let content = `
/**
 * 
 * autogenerated by solidity-visual-auditor
 * 
 * execute with: 
 *  #> truffle test <path/to/this/test.js>
 * 
 * */
var ${contract.name} = artifacts.require("${contract.path}");

contract('${contract.name}', (accounts) => {
    var creatorAddress = accounts[0];
    var firstOwnerAddress = accounts[1];
    var secondOwnerAddress = accounts[2];
    var externalAddress = accounts[3];
    var unprivilegedAddress = accounts[4]
    /* create named accounts for contract roles */

    before(async () => {
        /* before tests */
    })
    
    beforeEach(async () => {
        /* before each context */
    })

    it('should revert if ...', () => {
        return ${contract.name}.deployed()
            .then(instance => {
                return instance.publicOrExternalContractMethod(argument1, argument2, {from:externalAddress});
            })
            .then(result => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, "assert.fail()", "Reason ...");
            });
        });

    context('testgroup - security tests - description...', () => {
        //deploy a new contract
        before(async () => {
            /* before tests */
            const new${contract.name} =  await ${contract.name}.new()
        })
        

        beforeEach(async () => {
            /* before each tests */
        })

        

        it('fails on initialize ...', async () => {
            return assertRevert(async () => {
                await new${contract.name}.initialize()
            })
        })

        it('checks if method returns true', async () => {
            assert.isTrue(await new${contract.name}.thisMethodShouldReturnTrue())
        })
    })
});
`;
    return content;
}

module.exports = {
    generateUnittestStubForContract:generateUnittestStubForContract
}




    

    

    