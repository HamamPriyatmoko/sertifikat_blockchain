// Inisialisasi Web3 dengan deteksi MetaMask
async function initWeb3() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);
      console.log('✅ Web3 connected!');
      return new Web3(window.ethereum);
    } catch (error) {
      console.error('🚨 User denied account access:', error);
      alert('⚠️ Mohon izinkan akses MetaMask!');
    }
  } else {
    console.error('🚨 Web3 not detected! Please install MetaMask.');
    alert('❌ MetaMask tidak terdeteksi! Install dan login terlebih dahulu.');
  }
  return null;
}

// Kontrak ABI dan alamat
const contractAddress = '0x22358434d0B3bd65CA463f048981680cD770A31e';

const contractAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'id', type: 'uint256' },
      { indexed: false, internalType: 'address', name: 'penerima', type: 'address' },
      { indexed: false, internalType: 'string', name: 'nama', type: 'string' },
      { indexed: false, internalType: 'string', name: 'kursus', type: 'string' },
    ],
    name: 'SertifikatDiterbitkan',
    type: 'event',
  },
  {
    inputs: [],
    name: 'admin',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'daftarSertifikat',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'address', name: 'penerima', type: 'address' },
      { internalType: 'string', name: 'nama', type: 'string' },
      { internalType: 'string', name: 'kursus', type: 'string' },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [],
    name: 'jumlahSertifikat',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
  {
    inputs: [
      { internalType: 'address', name: 'penerima', type: 'address' },
      { internalType: 'string', name: 'nama', type: 'string' },
      { internalType: 'string', name: 'kursus', type: 'string' },
    ],
    name: 'terbitkanSertifikat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

let blockchainPendidikanContract;

// Inisialisasi kontrak setelah Web3 tersedia
async function initContract() {
  const web3 = await initWeb3();
  if (web3) {
    blockchainPendidikanContract = new web3.eth.Contract(contractAbi, contractAddress);
    console.log('✅ Contract connected:', blockchainPendidikanContract);
  }
}

// Fungsi untuk mendapatkan alamat admin
async function getAdminAddress() {
  try {
    if (!blockchainPendidikanContract) {
      console.error('🚨 Contract belum diinisialisasi!');
      return;
    }
    const adminAddress = await blockchainPendidikanContract.methods.admin().call();
    console.log('🔹 Admin Address:', adminAddress);
    document.getElementById('adminAddress').innerText = `Admin: ${adminAddress}`;
  } catch (error) {
    console.error('❌ Error getting admin address:', error);
  }
}

// Fungsi untuk mengajukan permintaan sertifikat
async function ajukanPermintaanSertifikat() {
  try {
    if (!blockchainPendidikanContract) {
      console.error('🚨 Contract belum diinisialisasi!');
      return;
    }

    // Minta akses MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    if (!web3.utils.isAddress(userAddress)) {
      throw new Error('❌ Alamat Ethereum tidak valid');
    }

    // Ambil input dari form
    const nama = document.getElementById('nama').value.trim();
    const kursus = document.getElementById('kursus').value.trim();

    if (!nama || !kursus) {
      throw new Error('⚠️ Nama dan Kursus harus diisi!');
    }

    // Estimasi gas
    const gasEstimate = await blockchainPendidikanContract.methods.terbitkanSertifikat(userAddress, nama, kursus)
      .estimateGas({ from: userAddress });

    // Kirim transaksi
    const result = await blockchainPendidikanContract.methods.terbitkanSertifikat(userAddress, nama, kursus)
      .send({ from: userAddress, gas: gasEstimate });

    // Tampilkan hasil di HTML
    document.getElementById('resultMessage').innerText = `✅ Sertifikat berhasil diajukan untuk ${nama} (${kursus}). TX: ${result.transactionHash}`;
    document.getElementById('certificateResult').style.display = 'block';

    console.log('✔️ Transaksi berhasil:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
    alert(error.message);
  }
}

// Panggil fungsi saat halaman dimuat
window.onload = async () => {
  await initContract();
  getAdminAddress(); // Dapatkan admin setelah kontrak terhubung
};
