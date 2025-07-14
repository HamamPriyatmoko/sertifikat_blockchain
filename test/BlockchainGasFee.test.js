const BlockchainSertifikasiPublik = artifacts.require('BlockchainSertifikasiPublik');

contract('BlockchainSertifikasiPublik - Gas Usage Tests', (accounts) => {
  let contract;
  const admin = accounts[0];

  beforeEach(async () => {
    contract = await BlockchainSertifikasiPublik.new({ from: admin });
  });

  it('mengukur gas yang digunakan saat menerbitkan sertifikat', async () => {
    const input = {
      nim: '001',
      universitas: 'Universitas Indonesia',
      cidDetail: 'Qm123abc',
      hashMetadata: '0xabc123',
      nomerSertifikat: 'SERT001',
    };

    const tx = await contract.terbitkanSertifikat(input, { from: admin });
    console.log('Gas digunakan untuk terbitkanSertifikat:', tx.receipt.gasUsed);

    const gasPrice = await web3.eth.getGasPrice();
    const costInWei = web3.utils.toBN(tx.receipt.gasUsed).mul(web3.utils.toBN(gasPrice));
    console.log('Estimasi biaya dalam Ether:', web3.utils.fromWei(costInWei, 'ether'));
  });

  it('mengestimasi gas saat memanggil getSertifikatById', async () => {
    const input = {
      nim: '002',
      universitas: 'Universitas Gadjah Mada',
      cidDetail: 'Qm456def',
      hashMetadata: '0xdef456',
      nomerSertifikat: 'SERT002',
    };

    await contract.terbitkanSertifikat(input, { from: admin });
    const id = await contract.idByNIM(input.nim);

    const estimatedGas = await contract.getSertifikatById.estimateGas(id, { from: admin });
    console.log('Estimasi gas untuk getSertifikatById:', estimatedGas);
  });

  it('mengestimasi gas saat memanggil findSertifikatHash', async () => {
    const input = {
      nim: '003',
      universitas: 'ITB',
      cidDetail: 'Qm789ghi',
      hashMetadata: '0xghi789',
      nomerSertifikat: 'SERT003',
    };

    await contract.terbitkanSertifikat(input, { from: admin });
    const estimatedGas = await contract.findSertifikatHash.estimateGas(input.hashMetadata, {
      from: admin,
    });
    console.log('Estimasi gas untuk findSertifikatHash:', estimatedGas);
  });
});
