const BlockchainSertifikasiPublik = artifacts.require('BlockchainSertifikasiPublik');

contract('BlockchainSertifikasiPublik', (accounts) => {
  let sertifikasiPublik;

  const penerbit1 = accounts[0];
  const penerbit2 = accounts[1];

  beforeEach(async () => {
    sertifikasiPublik = await BlockchainSertifikasiPublik.new();
  });

  it('seharusnya bisa menerbitkan sertifikat', async () => {
    const sertifikatInput = {
      nim: '12345',
      universitas: 'Universitas Terbuka A',
      cidDetail: 'Qm123abc',
      hashMetadata: '0x123abc',
      nomerSertifikat: 'SERT001',
    };

    await sertifikasiPublik.terbitkanSertifikat(sertifikatInput, { from: penerbit1 });

    const id = await sertifikasiPublik.idByNIM(sertifikatInput.nim);
    const sertifikat = await sertifikasiPublik.getSertifikatById(id);

    assert.equal(sertifikat.nim, sertifikatInput.nim, 'NIM tidak sesuai.');
    assert.equal(sertifikat.universitas, sertifikatInput.universitas, 'Universitas tidak sesuai.');
  });

  it('seharusnya menolak penerbitan sertifikat ganda untuk NIM yang sama', async () => {
    const sertifikatInput = {
      nim: '11122',
      universitas: 'Universitas C',
      cidDetail: 'Qm1122',
      hashMetadata: '0x1122',
      nomerSertifikat: 'SERT003',
    };

    await sertifikasiPublik.terbitkanSertifikat(sertifikatInput, { from: penerbit1 });

    try {
      await sertifikasiPublik.terbitkanSertifikat(sertifikatInput, { from: penerbit2 });
      assert.fail('Seharusnya transaksi ini gagal karena NIM sudah ada.');
    } catch (error) {
      assert.include(
        error.message,
        'Sertifikat untuk NIM ini sudah ada.',
        'Pesan error duplikasi NIM tidak sesuai.',
      );
    }
  });

  it('seharusnya menolak penerbitan jika CID detail kosong', async () => {
    const sertifikatInput = {
      nim: '77889',
      universitas: 'Universitas D',
      cidDetail: '',
      hashMetadata: '0x77889',
      nomerSertifikat: 'SERT004',
    };

    try {
      await sertifikasiPublik.terbitkanSertifikat(sertifikatInput, { from: penerbit1 });
      assert.fail('Seharusnya transaksi gagal karena CID kosong.');
    } catch (error) {
      assert.include(
        error.message,
        'CID tidak valid',
        'Pesan error untuk CID tidak valid tidak sesuai.',
      );
    }
  });

  it('seharusnya bisa mengambil sertifikat berdasarkan ID', async () => {
    const sertifikatInput = {
      nim: '99999',
      universitas: 'Universitas E',
      cidDetail: 'Qm999',
      hashMetadata: '0x999',
      nomerSertifikat: 'SERT005',
    };

    await sertifikasiPublik.terbitkanSertifikat(sertifikatInput, { from: penerbit1 });
    const id = await sertifikasiPublik.idByNIM(sertifikatInput.nim);
    const sertifikat = await sertifikasiPublik.getSertifikatById(id);

    assert.equal(sertifikat.nim, sertifikatInput.nim, 'NIM tidak sesuai.');
  });

  it('seharusnya bisa mengambil sertifikat berdasarkan hash metadata', async () => {
    const sertifikatInput = {
      nim: '88888',
      universitas: 'Universitas F',
      cidDetail: 'Qm888',
      hashMetadata: '0x888',
      nomerSertifikat: 'SERT006',
    };

    await sertifikasiPublik.terbitkanSertifikat(sertifikatInput, { from: penerbit1 });
    const sertifikat = await sertifikasiPublik.getSertifikatByHash(sertifikatInput.hashMetadata);

    assert.equal(sertifikat.nim, sertifikatInput.nim, 'NIM tidak sesuai.');
  });
});
