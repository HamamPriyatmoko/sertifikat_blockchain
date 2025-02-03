let web3;
let contract;
const contractAddress = '0x0d7Be2d770066FBfEb66d679035A403AE85c2F3E'; // Ganti dengan alamat smart contract Anda
const contractABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'penerima',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'nama',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'kursus',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'institusi',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tanggal',
        type: 'string',
      },
    ],
    name: 'SertifikatDiterbitkan',
    type: 'event',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'daftarSertifikat',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'penerima',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'nama',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'kursus',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'institusi',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tanggal',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'valid',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'jumlahSertifikat',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'sertifikatByPenerima',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'penerima',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'nama',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'kursus',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'institusi',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tanggal',
        type: 'string',
      },
    ],
    name: 'terbitkanSertifikat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'verifikasiSertifikat',
    outputs: [
      {
        internalType: 'address',
        name: 'penerima',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'nama',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'kursus',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'institusi',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'tanggal',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'valid',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'penerima',
        type: 'address',
      },
    ],
    name: 'cekSertifikatByPenerima',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

async function connectWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract = new web3.eth.Contract(contractABI, contractAddress);
    console.log('Connected to contract:', contract);
  } else {
    alert('Metamask tidak ditemukan! Silakan install Metamask.');
  }
}
// async function connectWeb3() {
//   if (window.ethereum) {
//     web3 = new Web3(window.ethereum);
//     await window.ethereum.request({ method: 'eth_requestAccounts' });

//     contract = new web3.eth.Contract(contractABI, contractAddress);
//     console.log('Connected to contract:', contract);

//     contract.events
//       .SertifikatDiterbitkan({
//         fromBlock: 'latest',
//       })
//       .on('data', function (event) {
//         console.log('Event Data:', event); // Log semua data event untuk debugging
//         console.log('Return Values:', event.returnValues); // Pastikan returnValues ada

//         if (event.returnValues) {
//           const { id, penerima, nama, kursus, institusi, tanggal } = event.returnValues;
//           alert(`Sertifikat diterbitkan dengan ID: ${id}`);
//           showSertifikatBaru(penerima, nama, kursus, institusi, tanggal, event.transactionHash, id);
//         } else {
//           console.error('Event returnValues tidak ditemukan!');
//         }
//       })
//       .on('error', function (error) {
//         console.error('Error catching event:', error);
//       });
//   } else {
//     alert('Metamask tidak ditemukan! Silakan install Metamask.');
//   }
// }
// async function connectWeb3() {
//   if (window.ethereum) {
//     // Menghubungkan ke jaringan Sepolia melalui MetaMask
//     web3 = new Web3(window.ethereum);
//     await window.ethereum.request({ method: 'eth_requestAccounts' });

//     // Setel jaringan ke Sepolia (gunakan RPC URL Infura atau Alchemy)
//     const networkId = await web3.eth.net.getId();
//     if (networkId === 11155111) {
//       // ID Sepolia testnet
//       console.log('Connected to Sepolia Testnet');
//     } else {
//       alert('Please switch to Sepolia testnet in your wallet.');
//       return;
//     }

//     contract = new web3.eth.Contract(contractABI, contractAddress);
//     console.log('Connected to contract:', contract);
//   } else {
//     alert('MetaMask not found! Please install MetaMask.');
//   }
// }

// Fungsi untuk menerbitkan sertifikat baru
document.getElementById('formSertifikat').addEventListener('submit', async function (event) {
  event.preventDefault();

  const accounts = await web3.eth.getAccounts();
  const adminAddress = accounts[0];

  const penerima = document.getElementById('penerima').value;
  const nama = document.getElementById('nama').value;
  const kursus = document.getElementById('kursus').value;
  const institusi = document.getElementById('institusi').value;
  const tanggal = document.getElementById('tanggal').value;

  try {
    // Kirim transaksi dengan gas limit dan gas price yang lebih tinggi
    const transaction = await contract.methods.terbitkanSertifikat(penerima, nama, kursus, institusi, tanggal).send({
      from: adminAddress,
      gas: 2000000, // Tentukan gas limit yang lebih tinggi
      gasPrice: web3.utils.toWei('10', 'gwei'), // Tentukan gas price, bisa disesuaikan
    });

    alert('Sertifikat berhasil diterbitkan!');
    const transactionHash = transaction.transactionHash; // Ambil hash transaksi
    showSertifikatBaru(penerima, nama, kursus, institusi, tanggal, transactionHash);
  } catch (error) {
    console.error('Gagal menerbitkan sertifikat:', error);
    alert('Gagal menerbitkan sertifikat.');
  }
});

// // Fungsi untuk memverifikasi sertifikat berdasarkan ID
// document.getElementById('formVerifikasi').addEventListener('submit', async function (event) {
//   event.preventDefault();

//   const sertifikatId = document.getElementById('verifikasi-id').value;
//   if (!sertifikatId) {
//     alert('ID sertifikat tidak boleh kosong.');
//     return;
//   }

//   try {
//     const sertifikat = await contract.methods.verifikasiSertifikat(sertifikatId).call();

//     // Tampilkan informasi sertifikat jika valid
//     document.getElementById('sertifikatInfo').style.display = 'block';
//     document.getElementById('verifikasi-nama').textContent = sertifikat.nama;
//     document.getElementById('verifikasi-kursus').textContent = sertifikat.kursus;
//     document.getElementById('verifikasi-institusi').textContent = sertifikat.institusi;
//     document.getElementById('verifikasi-tanggal').textContent = sertifikat.tanggal;
//     document.getElementById('verifikasi-status').textContent = sertifikat.valid ? 'Valid' : 'Tidak Valid';
//   } catch (error) {
//     console.error('Gagal verifikasi sertifikat:', error);
//     alert('Gagal memverifikasi sertifikat.');
//   }
// });

// Fungsi untuk menampilkan sertifikat yang baru diterbitkan
function showSertifikatBaru(penerima, nama, kursus, institusi, tanggal, transactionHash) {
  const sertifikatBaru = document.getElementById('sertifikatBaru');
  sertifikatBaru.innerHTML = `
    <h4>Sertifikat Baru Diterbitkan:</h4>
    <p><strong>Nama:</strong> ${nama}</p>
    <p><strong>Kursus:</strong> ${kursus}</p>
    <p><strong>Institusi:</strong> ${institusi}</p>
    <p><strong>Tanggal:</strong> ${tanggal}</p>
    <p><strong>Penerima:</strong> ${penerima}</p>
    <p><strong>Transaction Hash:</strong> <a href="https://etherscan.io/tx/${transactionHash}" target="_blank">${transactionHash}</a></p>
  `;
}

window.onload = connectWeb3;
