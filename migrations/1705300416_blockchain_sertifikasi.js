const BlockchainSertifikasi = artifacts.require('BlockchainSertifikasi');

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(BlockchainSertifikasi);
};
