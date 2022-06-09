const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledPaymentChannel = require('./build/PaymentChannel.json');
const bytecodePaymentChannel = require('./build/PaymentChannelBytecode.json');


const provider = new HDWalletProvider(
  'REPLACE_WITH_YOUR_MNEMONIC',
  // remember to change this to your own phrase!
  'https://ropsten.infura.io/v3/96c4a0abea8d43f3b62b1b6293cab035'
  // remember to change this to your own endpoint!
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledPaymentChannel)
    .deploy({ data: bytecodePaymentChannel.object, arguments: [10] }) // Este arguments é o argumento da constructor function
    .send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);

  provider.engine.stop();
};
deploy();

export const contractAddress = result.options.address;
