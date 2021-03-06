const solc = require('solc')
const Web3 = require('web3')
const fs = require('fs')

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
}
// Define the address to search witin.  CHANGE TO PULIC ADDRESSS ACTIVE private/test/live network
const addr = ('0x0b3333b602de2a1e4b922e3c12f95fab2f68f5d6')

// Use Wb3 to get the balance of the address, convert it and then show it in the console.
web3.eth.getBalance(addr, function (error, result) {
	if (!error)
    //console.log('blance -- ')
    console.log(result)
    //console.log('balance');
		//console.log('Ether:', web3.utils.fromWei(result,'ether')); // Show the ether balance after converting it from Wei
	else
		console.log('Huston we have a promblem: ', error) // Should dump errors here
});

web3.eth.getGasPrice()
.then(console.log)

var filepath = 'solidity/heartchain.sol';
var input = fs.readFileSync(filepath).toString()
// console.log(input);

var output = solc.compile(input, 1) // 1 activates the optimiser
console.log(output)
for (var contractName in output.contracts) {
  // code and ABI that are needed by web3
  //console.log(contractName + ': ' + output.contracts[contractName].bytecode);
  //console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface));

  var code = '0x' + output.contracts[contractName].bytecode
  // console.log(code);
  // contract json abi, this is autogenerated using solc CLI
  var abi = JSON.parse(output.contracts[contractName].interface)
  // console.log(abi);
  var myContract;
  // var blockwatch = web3.eth.filter('latest')
  // console.log(blockwatch)
  // console.log(web3)

  var myContract = new web3.eth.Contract(abi,{
      from: addr, // default from address
      gasPrice: '10000000000000' // default gas price in wei, 20 gwei in this case
  })
   console.log(myContract);

  var deployContract = myContract.deploy({data:code})

  deployContract.send({
      from: addr,
      gas: 2100000,
      gasPrice: '10000000000000'
    }, function(error, transactionHash){ })
    .on('error', function(error){
      console.log(error)
    })
    .on('transactionHash', function(transactionHash){
      console.log(transactionHash)

     })
    .on('receipt', function(receipt){
       console.log(receipt.contractAddress) // contains the new contract address

    })
    .on('confirmation', function(confirmationNumber, receipt){
        // console.log('confirm');
        // console.log(receipt);
      })
    .then(function(newContractInstance){
        console.log('now use transation');
        // console.log(newContractInstance);
        // console.log(newContractInstance.options.address) // instance with the new contract address
        newContractInstance.methods.liveChain().send({from: addr}).then(function(receipt){
            // receipt can also be a new contract instance, when coming fro
        console.log('put value address to contract');
        console.log(receipt);
        }).catch(function(error) {
        console.log(' send error')
        console.log(error)
        })
        .then(function(){
            console.log('reacall function');
            // console.log(newContractInstance);
            newContractInstance.methods.getHCstatus().call({from: addr}).then(function(receipt){
                // receipt can also be a new contract instance, when coming fro
                console.log('call back from');
                console.log(receipt);
            }).catch(function(error) {
            console.log(' call error')
            console.log(error)
            })
        })
    })
    .catch(function(error) {
    console.log(error)
    console.log(' recall catch')
    })
  .catch(function(error) {
  console.log(error)
  console.log(' last then catch')
  })

}
