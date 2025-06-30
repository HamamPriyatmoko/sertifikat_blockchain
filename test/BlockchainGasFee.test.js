const BlockchainSertifikasi = artifacts.require('BlockchainSertifikasi');

contract('BlockchainSertifikasi - Gas Usage Tests', (accounts) => {
  let contract;
  const admin = accounts[0];

  beforeEach(async () => {
    contract = await BlockchainSertifikasi.new({ from: admin });
  });

  it('mengukur gas fee saat menerbitkan sertifikat', async () => {
    const input = {
      nim: '001',
      universitas: 'Universitas Indonesia',
      cidDetail: 'Qm123abc',
      hashMetadata: '0xabc123',
      nomerSertifikat: 'SERT001',
    };

    const tx = await contract.terbitkanSertifikat(input, { from: admin });
    console.log("Gas digunakan untuk terbitkanSertifikat:", tx.receipt.gasUsed);
  });

  it('mengukur gas fee saat memanggil getSertifikatById', async () => {
    const input = {
      nim: '002',
      universitas: 'Universitas Gadjah Mada',
      cidDetail: 'Qm456def',
      hashMetadata: '0xdef456',
      nomerSertifikat: 'SERT002',
    };

    await contract.terbitkanSertifikat(input, { from: admin });
    const id = await contract.idByNIM(input.nim);

    const tx = await contract.getSertifikatById.estimateGas(id, { from: admin });
    console.log("Estimasi gas getSertifikatById:", tx);
  });

  it('mengukur gas fee saat memanggil getSertifikatByHash', async () => {
    const input = {
      nim: '003',
      universitas: 'ITB',
      cidDetail: 'Qm789ghi',
      hashMetadata: '0xghi789',
      nomerSertifikat: 'SERT003',
    };

    await contract.terbitkanSertifikat(input, { from: admin });
    const tx = await contract.getSertifikatByHash.estimateGas(input.hashMetadata, { from: admin });
    console.log("Estimasi gas getSertifikatByHash:", tx);
  });

});
