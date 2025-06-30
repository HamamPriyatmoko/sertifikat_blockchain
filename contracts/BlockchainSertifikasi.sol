// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasi { 
    address public admin;
    bytes32[] public allIds;

    struct SertifikatInput {
        string nim;
        string universitas;
        string cidDetail;
        string hashMetadata;
        string nomerSertifikat;
    }

    struct Sertifikat {
        bytes32 id;
        string nim;
        string universitas;
        string cidDetail;
        string hashMetadata;
        string nomerSertifikat;
        uint blockNumber;
    }

    mapping(bytes32 => Sertifikat) public daftarSertifikat;
    mapping(string => bytes32) public idByNIM;
    mapping(string => bytes32) public idByHashMetadata;

    event SertifikatDiterbitkan(
        bytes32 id,
        string nim,
        string universitas,
        string cidDetail,
        string nomerSertifikat,
        string hashMetadata
    );

    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat menjalankan fungsi ini");
        _; 
    }

    constructor() {
        admin = msg.sender;
    }

    function ubahAdmin(address _adminBaru) public hanyaAdmin {
        admin = _adminBaru;
    }

    function terbitkanSertifikat(SertifikatInput memory _input) public hanyaAdmin {
        // Cek apakah NIM sudah terdaftar
        require(idByNIM[_input.nim] == bytes32(0), "Sertifikat untuk NIM ini sudah ada.");
        
        // Validasi CID detail tidak kosong
        require(bytes(_input.cidDetail).length > 0, "CID tidak valid");

        // Buat ID unik berdasarkan NIM dan nomor sertifikat
        bytes32 id = keccak256(abi.encodePacked(block.timestamp, _input.nim, _input.nomerSertifikat));

        // Simpan sertifikat
        daftarSertifikat[id] = Sertifikat(
            id,
            _input.nim,
            _input.universitas,
            _input.cidDetail,
            _input.hashMetadata,
            _input.nomerSertifikat,
            block.number
        );
        
        allIds.push(id);
        idByNIM[_input.nim] = id;
        idByHashMetadata[_input.hashMetadata] = id;

        // Emit event
        emit SertifikatDiterbitkan(
            id, 
            _input.nim, 
            _input.universitas, 
            _input.cidDetail, 
            _input.nomerSertifikat, 
            _input.hashMetadata
        );
    }

    function getAllId() public view returns (bytes32[] memory) {
        return allIds;
    }

    function getSertifikatById(bytes32 id) public view returns (Sertifikat memory) { 
        // Validasi ID
        require(daftarSertifikat[id].id != bytes32(0), "Sertifikat tidak ditemukan.");
        return daftarSertifikat[id];
    }

    function getSertifikatByHash(string memory _hashMetadata) public view returns (Sertifikat memory) {
        bytes32 id = idByHashMetadata[_hashMetadata];
        require(id != bytes32(0), "Sertifikat dengan hash metadata ini tidak ditemukan.");
        return daftarSertifikat[id];
    }
}
