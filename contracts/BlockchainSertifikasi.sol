// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasi {
    address public admin;
    bytes32[] public allIds;

    struct Sertifikat {
        bytes32 id;
        string nama;
        string universitas;
        string jurusan;
        string sertifikatToefl; 
        string sertifikatBTA; 
        string sertifikatSKP;
        string tanggal;
        string urlCid;
        uint blockNumber;   // Nomor blok saat diterbitkan
        bool valid;
    }

    mapping(bytes32 => Sertifikat) public daftarSertifikat;
    mapping(bytes32 => string) public hashById;
    mapping(bytes32 => bytes32) public idByHash;

    event SertifikatDiterbitkan(
        bytes32 id,
        string nama,
        string universitas,
        string jurusan,
        string sertifikatToefl,
        string sertifikatBTA,
        string sertifikatSKP,
        string tanggal,
        string dataHash,
        string urlCid,
        uint blockNumber     // Emit nomor blok
    );

    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat menjalankan fungsi ini");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function terbitkanSertifikat(
        string memory nama,
        string memory universitas,
        string memory jurusan,
        string memory sertifikatToefl,
        string memory sertifikatBTA,
        string memory sertifikatSKP,
        string memory tanggal,
        string memory dataHash,
        string memory urlCid
    ) public hanyaAdmin {
        bytes32 hashKey = keccak256(abi.encodePacked(dataHash));
        require(idByHash[hashKey] == bytes32(0), "Hash sudah digunakan");

        bytes32 id = keccak256(abi.encodePacked(tanggal, block.number, block.timestamp, nama, universitas));
        require(!daftarSertifikat[id].valid, "Sertifikat sudah ada");

        daftarSertifikat[id] = Sertifikat(
            id,
            nama,
            universitas,
            jurusan,
            sertifikatToefl,
            sertifikatBTA,
            sertifikatSKP,
            tanggal,
            urlCid,
            block.number,    // Simpan nomor blok di struct
            true
        );
        allIds.push(id);
        hashById[id] = dataHash;
        idByHash[hashKey] = id;

        emit SertifikatDiterbitkan(
            id,
            nama,
            universitas,
            jurusan,
            sertifikatToefl,
            sertifikatBTA,
            sertifikatSKP,
            tanggal,
            dataHash,
            urlCid,
            block.number     // Emit nomor blok
        );
    }

    function getAllIds() public view returns (bytes32[] memory) {
        return allIds;
    }

    function getSertifikat(bytes32 id) public view returns (
        string memory nama,
        string memory universitas,
        string memory jurusan,
        string memory sertifikatToefl,
        string memory sertifikatBTA,
        string memory sertifikatSKP,
        string memory tanggal,
        string memory urlCid,
        uint blockNumber,
        bool valid
    ) {
        require(daftarSertifikat[id].valid, "Sertifikat tidak ditemukan atau tidak valid");
        Sertifikat memory cert = daftarSertifikat[id];
        return (
            cert.nama,
            cert.universitas,
            cert.jurusan,
            cert.sertifikatToefl,
            cert.sertifikatBTA,
            cert.sertifikatSKP,
            cert.tanggal,
            cert.urlCid,
            cert.blockNumber,    // Kembalikan nomor blok
            cert.valid
        );
    }

    function verifyHash(string memory dataHash) public view returns (bytes32) {
    return idByHash[keccak256(abi.encodePacked(dataHash))];
    }
    function getHashById(bytes32 id) public view returns (string memory) {
        require(daftarSertifikat[id].valid, "Hash untuk sertifikat tidak ditemukan");
        return hashById[id];
    }
}
