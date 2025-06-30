const BlockchainSertifikasi = artifacts.require('BlockchainSertifikasi');

contract('BlockchainSertifikasi', (accounts) => {
  let blockchainSertifikasi;
  const admin = accounts[0];
  const user = accounts[1];

  // Setup kontrak sebelum setiap tes
  beforeEach(async () => {
    blockchainSertifikasi = await BlockchainSertifikasi.new();
  });

  // Pengujian: Memastikan admin adalah pengelola yang sah
  it('seharusnya menetapkan admin sebagai pengelola kontrak', async () => {
    const currentAdmin = await blockchainSertifikasi.admin();
    assert.equal(currentAdmin, admin, 'Admin tidak benar.');
  });

  // Pengujian: Memastikan sertifikat dapat diterbitkan oleh admin
  it('seharusnya bisa menerbitkan sertifikat', async () => {
    const sertifikatInput = {
      nim: '12345',
      universitas: 'Universitas A',
      cidDetail: 'Qm123abc',
      hashMetadata: '0x123abc',
      nomerSertifikat: 'SERT001',
    };

    await blockchainSertifikasi.terbitkanSertifikat(sertifikatInput, { from: admin });

    const id = await blockchainSertifikasi.idByNIM(sertifikatInput.nim);
    const sertifikat = await blockchainSertifikasi.getSertifikatById(id);

    assert.equal(sertifikat.nim, sertifikatInput.nim, 'NIM tidak sesuai.');
    assert.equal(sertifikat.universitas, sertifikatInput.universitas, 'Universitas tidak sesuai.');
    assert.equal(sertifikat.cidDetail, sertifikatInput.cidDetail, 'CID Detail tidak sesuai.');
    assert.equal(
      sertifikat.nomerSertifikat,
      sertifikatInput.nomerSertifikat,
      'Nomor Sertifikat tidak sesuai.',
    );
  });

  // Pengujian: Memastikan hanya admin yang bisa menerbitkan sertifikat
  it('seharusnya menolak penerbitan sertifikat oleh non-admin', async () => {
    const sertifikatInput = {
      nim: '54321',
      universitas: 'Universitas B',
      cidDetail: 'Qm543xyz',
      hashMetadata: '0x543xyz',
      nomerSertifikat: 'SERT002',
    };

    try {
      await blockchainSertifikasi.terbitkanSertifikat(sertifikatInput, { from: user });
      assert.fail('Seharusnya transaksi ini gagal');
    } catch (error) {
      assert.include(
        error.message,
        'Hanya admin yang dapat menjalankan fungsi ini',
        'Pesan error tidak sesuai.',
      );
    }
  });

  // Pengujian: Memastikan tidak ada sertifikat ganda untuk NIM yang sama
  it('seharusnya tidak mengizinkan penerbitan sertifikat ganda untuk NIM yang sama', async () => {
    const sertifikatInput = {
      nim: '12345',
      universitas: 'Universitas A',
      cidDetail: 'Qm123abc',
      hashMetadata: '0x123abc',
      nomerSertifikat: 'SERT001',
    };

    await blockchainSertifikasi.terbitkanSertifikat(sertifikatInput, { from: admin });

    try {
      await blockchainSertifikasi.terbitkanSertifikat(sertifikatInput, { from: admin });
      assert.fail('Seharusnya transaksi ini gagal karena NIM sudah ada.');
    } catch (error) {
      assert.include(
        error.message,
        'Sertifikat untuk NIM ini sudah ada',
        'Pesan error tidak sesuai.',
      );
    }
  });

  // Pengujian: Memastikan kita dapat mengambil sertifikat berdasarkan ID
  it('seharusnya bisa mengambil sertifikat berdasarkan ID', async () => {
    const sertifikatInput = {
      nim: '12345',
      universitas: 'Universitas A',
      cidDetail: 'Qm123abc',
      hashMetadata: '0x123abc',
      nomerSertifikat: 'SERT001',
    };

    await blockchainSertifikasi.terbitkanSertifikat(sertifikatInput, { from: admin });
    const id = await blockchainSertifikasi.idByNIM(sertifikatInput.nim);
    const sertifikat = await blockchainSertifikasi.getSertifikatById(id);

    assert.equal(sertifikat.nim, sertifikatInput.nim, 'NIM tidak sesuai.');
  });

  // Pengujian: Memastikan kita bisa mengambil sertifikat berdasarkan hash metadata
  it('seharusnya bisa mengambil sertifikat berdasarkan hash metadata', async () => {
    const sertifikatInput = {
      nim: '12345',
      universitas: 'Universitas A',
      cidDetail: 'Qm123abc',
      hashMetadata: '0x123abc',
      nomerSertifikat: 'SERT001',
    };

    await blockchainSertifikasi.terbitkanSertifikat(sertifikatInput, { from: admin });
    const sertifikat = await blockchainSertifikasi.getSertifikatByHash(
      sertifikatInput.hashMetadata,
    );

    assert.equal(sertifikat.nim, sertifikatInput.nim, 'NIM tidak sesuai.');
  });

  // Pengujian: Memastikan hanya admin yang bisa mengubah admin
  it('seharusnya hanya admin yang dapat mengubah admin', async () => {
    await blockchainSertifikasi.ubahAdmin(user, { from: admin });
    const newAdmin = await blockchainSertifikasi.admin();
    assert.equal(newAdmin, user, 'Admin belum diubah.');
  });

  // Pengujian: Memastikan non-admin tidak dapat mengubah admin
  it('seharusnya tidak dapat mengubah admin oleh non-admin', async () => {
    try {
      await blockchainSertifikasi.ubahAdmin(user, { from: user });
      assert.fail('Seharusnya transaksi ini gagal');
    } catch (error) {
      assert.include(
        error.message,
        'Hanya admin yang dapat menjalankan fungsi ini',
        'Pesan error tidak sesuai.',
      );
    }
  });
});
