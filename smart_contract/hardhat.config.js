// https://eth-ropsten.alchemyapi.io/v2/UwsaAPN4IlOAw9A5N4h5wqDoDU6_Wj5s

require('@nomiclabs/hardhat-waffle');

module.exports ={
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/UwsaAPN4IlOAw9A5N4h5wqDoDU6_Wj5s',
      accounts: ['d058052eeb1f62279cc2b27045e5532608879b6867aab7d742534c297e44e2c7']
    }
  }
}
