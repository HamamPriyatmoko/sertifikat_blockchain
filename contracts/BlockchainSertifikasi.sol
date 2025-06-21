// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasi { 
    address public admin;
    bytes32[] public allIds;

    struct SertifikatInput {
        string nim;
        string nama;
        string universitas;
        string jurusan;
        string tanggalTerbit;
        string hashMetadata;
        string cidSuratBebasPerpustakaan;
        string cidSuratBebasLaboratorium;
        string cidSuratBebasKeuangan;
        string cidBuktiPenyerahanSkripsi;
        string cidSertifikatToefl;
    }

    struct Sertifikat {
        bytes32 id;
        string nim;
        string nama;
        string universitas;
        string jurusan;
        string tanggalTerbit;
        string hashMetadata; // <-- DIUBAH MENJADI STRING
        string cidSuratBebasPerpustakaan;
        string cidSuratBebasLaboratorium;
        string cidSuratBebasKeuangan;
        string cidBuktiPenyerahanSkripsi;
        string cidSertifikatToefl;
        uint blockNumber;
        bool valid;
    }

    mapping(bytes32 => Sertifikat) public daftarSertifikat;
    mapping(string => bytes32) internal idByNIM;
    // Kunci mapping diubah menjadi string karena hashMetadata sekarang string
    mapping(string => bytes32) public idByHashMetadata; // <-- DIUBAH MENJADI STRING KEY

    event SertifikatDiterbitkan(
        bytes32 id,
        string nim,
        string nama,
        string tanggalTerbit,
        string hashMetadata // <-- DIUBAH MENJADI STRING
    );

    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat menjalankan fungsi ini");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function terbitkanSertifikat(SertifikatInput memory _input) public hanyaAdmin {
        require(idByNIM[_input.nim] == bytes32(0), "Sertifikat untuk NIM ini sudah ada.");
        // Pengecekan keunikan hash menggunakan string key
        require(idByHashMetadata[_input.hashMetadata] == bytes32(0), "Metadata sertifikat ini sudah terdaftar.");

        bytes32 id = keccak256(abi.encodePacked(block.timestamp, _input.nim, _input.nama));

        daftarSertifikat[id] = Sertifikat(
            id,
            _input.nim,
            _input.nama,
            _input.universitas,
            _input.jurusan,
            _input.tanggalTerbit,
            _input.hashMetadata, // Disimpan sebagai string
            _input.cidSuratBebasPerpustakaan,
            _input.cidSuratBebasLaboratorium,
            _input.cidSuratBebasKeuangan,
            _input.cidBuktiPenyerahanSkripsi,
            _input.cidSertifikatToefl,
            block.number,
            true
        );
        
        allIds.push(id);
        idByNIM[_input.nim] = id;
        idByHashMetadata[_input.hashMetadata] = id;

        emit SertifikatDiterbitkan(id, _input.nim, _input.nama, _input.tanggalTerbit, _input.hashMetadata);
    }

    function getSertifikatById(bytes32 id) public view returns (Sertifikat memory) { 
        require(daftarSertifikat[id].valid, "Sertifikat tidak ditemukan.");
        return daftarSertifikat[id];
    }

    // Fungsi ini sekarang menerima string sebagai parameter
    function getSertifikatByHash(string memory _hashMetadata) public view returns (Sertifikat memory) { // <-- DIUBAH MENJADI STRING
        bytes32 id = idByHashMetadata[_hashMetadata];
        require(id != bytes32(0), "Sertifikat dengan hash metadata ini tidak ditemukan.");
        return daftarSertifikat[id];
    }
}