// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasiPublik { 

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
        uint timestamp;
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
        string hashMetadata,
        uint blockNumber,
        uint timestamp
    );

    function terbitkanSertifikat(SertifikatInput memory _input) public {
        require(idByNIM[_input.nim] == bytes32(0), "Sertifikat untuk NIM ini sudah ada.");
        require(bytes(_input.cidDetail).length > 0, "CID tidak valid");

        bytes32 id = keccak256(abi.encodePacked(block.timestamp, msg.sender, _input.nim, _input.nomerSertifikat));
        uint WaktuTerbit = block.timestamp;

        daftarSertifikat[id] = Sertifikat(
            id,
            _input.nim,
            _input.universitas,
            _input.cidDetail,
            _input.hashMetadata,
            _input.nomerSertifikat,
            block.number,
            WaktuTerbit
        );
        
        allIds.push(id);
        idByNIM[_input.nim] = id;
        idByHashMetadata[_input.hashMetadata] = id;

        emit SertifikatDiterbitkan(
            id, 
            _input.nim, 
            _input.universitas, 
            _input.cidDetail, 
            _input.nomerSertifikat, 
            _input.hashMetadata,
            block.number,
            WaktuTerbit
        );
    }

    function getAllId() public view returns (bytes32[] memory) {
        return allIds;
    }

    function getSertifikatById(bytes32 id) public view returns (Sertifikat memory) { 
        require(daftarSertifikat[id].id != bytes32(0), "Sertifikat tidak ditemukan.");
        return daftarSertifikat[id];
    }

    function findSertifikatHash(string memory _hashMetadata) public view returns (Sertifikat memory) {
        bytes32 id = idByHashMetadata[_hashMetadata];
        require(id != bytes32(0), "Sertifikat dengan hash metadata ini tidak ditemukan.");
        return daftarSertifikat[id];
    }
}