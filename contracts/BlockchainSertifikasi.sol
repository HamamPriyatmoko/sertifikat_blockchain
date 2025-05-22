// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasi {
    address public admin;

    struct Sertifikat {
        uint id;
        address penerima;
        string nama;
        string kursus;
        string institusi;
        string tanggal;
        bool valid;
    }

    mapping(uint => Sertifikat) public daftarSertifikat;
    mapping(address => uint) public sertifikatIdByPenerima; // Simpan ID sertifikat per penerima, 0 berarti belum ada
    mapping(address => string) public hashByPenerima;       // Simpan satu hash per penerima

    uint public jumlahSertifikat;

    event SertifikatDiterbitkan(
        uint id,
        address penerima,
        string nama,
        string kursus,
        string institusi,
        string tanggal,
        string dataHash
    );

    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat menjalankan fungsi ini");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function terbitkanSertifikat(
        address penerima,
        string memory nama,
        string memory kursus,
        string memory institusi,
        string memory tanggal,
        string memory dataHash
    ) public hanyaAdmin {
        require(sertifikatIdByPenerima[penerima] == 0, "Penerima sudah memiliki sertifikat");

        uint id = jumlahSertifikat + 1;
        daftarSertifikat[id] = Sertifikat(id, penerima, nama, kursus, institusi, tanggal, true);

        sertifikatIdByPenerima[penerima] = id;
        hashByPenerima[penerima] = dataHash;

        jumlahSertifikat++;
        emit SertifikatDiterbitkan(id, penerima, nama, kursus, institusi, tanggal, dataHash);
    }

    function verifikasiSertifikat(uint id) public view returns (
        address penerima,
        string memory nama,
        string memory kursus,
        string memory institusi,
        string memory tanggal,
        bool valid
    ) {
        require(daftarSertifikat[id].valid, "Sertifikat tidak ditemukan atau tidak valid");
        Sertifikat memory cert = daftarSertifikat[id];
        return (cert.penerima, cert.nama, cert.kursus, cert.institusi, cert.tanggal, cert.valid);
    }

    function cekSertifikatByPenerima(address penerima) public view returns (uint) {
        return sertifikatIdByPenerima[penerima];
    }

    function getHashByPenerima(address penerima) public view returns (string memory) {
        return hashByPenerima[penerima];
    }
}
