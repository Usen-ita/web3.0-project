// https://eth-ropsten.alchemyapi.io/v2/UwsaAPN4IlOAw9A5N4h5wqDoDU6_Wj5s
// enter private key of metamask account in line 11

require('@nomiclabs/hardhat-waffle');

module.exports ={
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/UwsaAPN4IlOAw9A5N4h5wqDoDU6_Wj5s',
      accounts: ['##']
    }
  }
}
