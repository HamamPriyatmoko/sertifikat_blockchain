// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract BlockchainSertifikasi {
    address public admin;
    
    mapping(address => bool) public isApprover;
    address[] public approverList;
    uint public requiredApprovals;

    // ... (Struct Proposal dan Sertifikat tidak berubah) ...
    struct Proposal {
        bytes32 proposalId;
        string nama;
        string universitas;
        string jurusan;
        string tanggal;
        string manifestCid;
        address proposer;
        bool isFinalized;
        uint approvalCount;
    }

    struct Sertifikat {
        bytes32 id;
        string nama;
        string universitas;
        string jurusan;
        string tanggal;
        string manifestCid;
        uint blockNumber;
        bool valid;
    }

    mapping(bytes32 => Proposal) public proposals;
    mapping(bytes32 => mapping(address => bool)) public approvals;
    mapping(bytes32 => Sertifikat) public daftarSertifikat;
    bytes32[] public allFinalizedIds;

    event ProposalDiajukan(bytes32 proposalId, address proposer, string manifestCid);
    event ProposalDisetujui(bytes32 proposalId, address approver);
    event SertifikatDifinalisasi(bytes32 id, string manifestCid, uint blockNumber);
    event ApproverDitambahkan(address indexed approver);
    event ApproverDihapus(address indexed approver);


    modifier hanyaAdmin() {
        require(msg.sender == admin, "Hanya admin yang dapat menjalankan fungsi ini");
        _;
    }

    modifier hanyaApprover() {
        require(isApprover[msg.sender], "Hanya approver yang dapat menjalankan fungsi ini");
        _;
    }

    // --- CONSTRUCTOR BARU (LEBIH SEDERHANA) ---
    constructor(uint _requiredApprovals) {
        admin = msg.sender;
        // Pastikan jumlah persetujuan yang dibutuhkan valid
        require(_requiredApprovals > 0, "Jumlah persetujuan harus lebih dari 0");
        requiredApprovals = _requiredApprovals;
    }
    

    /**
     * @dev Menambahkan alamat baru sebagai approver. Hanya bisa dipanggil oleh admin.
     * @param _newApprover Alamat approver yang akan ditambahkan.
     */
    function addApprover(address _newApprover) public hanyaAdmin {
        require(_newApprover != address(0), "Alamat approver tidak valid");
        require(!isApprover[_newApprover], "Alamat ini sudah menjadi approver");
        
        isApprover[_newApprover] = true;
        approverList.push(_newApprover);
        
        emit ApproverDitambahkan(_newApprover);
    }

    /**
     * @dev Menghapus approver dari daftar. Hanya bisa dipanggil oleh admin.
     * @param _approverToRemove Alamat approver yang akan dihapus.
     */
    function removeApprover(address _approverToRemove) public hanyaAdmin {
        require(isApprover[_approverToRemove], "Alamat ini bukan seorang approver");
        
        // Hapus dari mapping
        isApprover[_approverToRemove] = false;

        // Hapus dari array 'approverList' dengan metode "swap and pop"
        // Ini lebih efisien daripada menggeser semua elemen.
        for (uint i = 0; i < approverList.length; i++) {
            if (approverList[i] == _approverToRemove) {
                // Ganti elemen yang akan dihapus dengan elemen terakhir
                approverList[i] = approverList[approverList.length - 1];
                // Hapus elemen terakhir dari array
                approverList.pop();
                break;
            }
        }
        
        emit ApproverDihapus(_approverToRemove);
    }

    /**
     * @dev Untuk mendapatkan daftar semua approver saat ini.
     */
    function getApprovers() public view returns (address[] memory) {
        return approverList;
    }


    // --- FUNGSI PROPOSAL DAN FINALISASI (TIDAK BERUBAH) ---
    
    function ajukanProposalSertifikat(
        string memory nama,
        string memory universitas,
        string memory jurusan,
        string memory tanggal,
        string memory manifestCid
    ) public hanyaAdmin {
        // ... (logika fungsi ini tetap sama) ...
        bytes32 proposalId = keccak256(abi.encodePacked(manifestCid, block.timestamp));
        
        proposals[proposalId] = Proposal({
            proposalId: proposalId,
            nama: nama,
            universitas: universitas,
            jurusan: jurusan,
            tanggal: tanggal,
            manifestCid: manifestCid,
            proposer: msg.sender,
            isFinalized: false,
            approvalCount: 0
        });

        emit ProposalDiajukan(proposalId, msg.sender, manifestCid);
    }

    function setujuiProposal(bytes32 proposalId) public hanyaApprover {
        // ... (logika fungsi ini tetap sama) ...
         require(proposals[proposalId].proposalId != bytes32(0), "Proposal tidak ditemukan");
        require(!proposals[proposalId].isFinalized, "Proposal sudah difinalisasi");
        require(!approvals[proposalId][msg.sender], "Anda sudah menyetujui proposal ini");

        approvals[proposalId][msg.sender] = true;
        proposals[proposalId].approvalCount++;

        emit ProposalDisetujui(proposalId, msg.sender);
    }

    function finalisasiSertifikat(bytes32 proposalId) public hanyaAdmin {
        // ... (logika fungsi ini tetap sama) ...
        Proposal storage p = proposals[proposalId];
        require(p.proposalId != bytes32(0), "Proposal tidak ditemukan");
        require(!p.isFinalized, "Proposal sudah difinalisasi");
        require(p.approvalCount >= requiredApprovals, "Jumlah persetujuan belum mencukupi");
        
        p.isFinalized = true;
        bytes32 sertifikatId = proposalId;

        daftarSertifikat[sertifikatId] = Sertifikat({
            id: sertifikatId,
            nama: p.nama,
            universitas: p.universitas,
            jurusan: p.jurusan,
            tanggal: p.tanggal,
            manifestCid: p.manifestCid,
            blockNumber: block.number,
            valid: true
        });

        allFinalizedIds.push(sertifikatId);
        emit SertifikatDifinalisasi(sertifikatId, p.manifestCid, block.number);
    }
}