const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');

const provider = new HDWalletProvider(
  'tree sniff decide notice one fit patient organ sample napkin thank panel',
  'https://goerli.infura.io/v3/f09bf32302234d8ca7689cff5e208e95'
);
const web3 = new Web3(provider);

const deploy = async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  // Use one of those accounts to deploy the contract
  const result = await new web3.eth.Contract(abi)
  .deploy({ data: evm.bytecode.object, arguments: ['Hi there!'] })
  .send({ from: accounts[0], gas: '1000000' });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};

deploy();
