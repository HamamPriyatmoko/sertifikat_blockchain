const BlockchainSertifikasi = artifacts.require('BlockchainSertifikasi');

module.exports = function (deployer) {
  // Tentukan jumlah persetujuan yang dibutuhkan saat deployment.
  // Misalnya, kita butuh minimal 3 persetujuan.
  const requiredApprovals = 3;

  // Deploy kontrak hanya dengan argumen 'requiredApprovals'
  deployer.deploy(BlockchainSertifikasi, requiredApprovals);
};
