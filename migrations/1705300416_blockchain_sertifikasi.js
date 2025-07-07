const BlockchainSertifikasi = artifacts.require('BlockchainSertifikasiPublik');

module.exports = function (_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(BlockchainSertifikasi);
};
