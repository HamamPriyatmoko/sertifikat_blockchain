// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasi {
  address public admin;

    struct Sertifikat {
        uint id;
        address penerima;
        string nama;
        string kursus;
    }

    mapping(uint => Sertifikat) public daftarSertifikat;

    uint public jumlahSertifikat;

    event SertifikatDiterbitkan(uint id, address penerima, string nama, string kursus);

    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat menjalankan fungsi ini");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function terbitkanSertifikat(address penerima, string memory nama, string memory kursus) public hanyaAdmin {
        uint id = jumlahSertifikat + 1;
        daftarSertifikat[id] = Sertifikat(id, penerima, nama, kursus);
        jumlahSertifikat++;
        emit SertifikatDiterbitkan(id, penerima, nama, kursus);
    }
}
