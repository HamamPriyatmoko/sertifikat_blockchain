let web3;
let contract;
const contractAddress = '0x63fd5C0432E748642F613FC30f7cCEe84DB71171';
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
    constant: true,
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
    constant: true,
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
    constant: true,
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
    constant: true,
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
    constant: true,
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
    constant: true,
  },
];

async function loadWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    alert('Harap instal MetaMask!');
  }
}

async function loadContract() {
  contract = new web3.eth.Contract(contractABI, contractAddress);
}

async function terbitkanSertifikat(event) {
  event.preventDefault();

  const accounts = await web3.eth.getAccounts();
  const admin = accounts[0];

  const penerima = document.getElementById('penerima').value;
  const nama = document.getElementById('nama').value;
  const kursus = document.getElementById('kursus').value;
  const institusi = document.getElementById('institusi').value;
  const tanggal = document.getElementById('tanggal').value;

  const receipt = await contract.methods.terbitkanSertifikat(penerima, nama, kursus, institusi, tanggal).send({ from: admin });
  // Menampilkan hash transaksi di dalam halaman, bukan alert
  document.getElementById('hashTransaksi').innerText = `Hash Transaksi: ${receipt.transactionHash}`;
  tampilkanSertifikat();
}

async function tampilkanSertifikat() {
  const jumlahSertifikat = await contract.methods.jumlahSertifikat().call();
  const tableBody = document.getElementById('daftarSertifikat');
  tableBody.innerHTML = '';

  for (let i = 1; i <= jumlahSertifikat; i++) {
    const cert = await contract.methods.verifikasiSertifikat(i).call();

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i}</td>
      <td>${cert.penerima}</td>
      <td>${cert.nama}</td>
      <td>${cert.kursus}</td>
      <td>${cert.institusi}</td>
      <td>${cert.tanggal}</td>
      <td>${cert.valid ? 'Valid' : 'Tidak Valid'}</td>
    `;
    tableBody.appendChild(row);
  }
}

async function verifikasiSertifikat() {
  const id = document.getElementById('verifikasiId').value;
  if (!id) {
    alert('Masukkan ID sertifikat!');
    return;
  }

  try {
    const cert = await contract.methods.verifikasiSertifikat(id).call();
    document.getElementById('verifikasiHasil').innerHTML = `
      <p><strong>Penerima:</strong> ${cert.penerima}</p>
      <p><strong>Nama:</strong> ${cert.nama}</p>
      <p><strong>Kursus:</strong> ${cert.kursus}</p>
      <p><strong>Institusi:</strong> ${cert.institusi}</p>
      <p><strong>Tanggal:</strong> ${cert.tanggal}</p>
      <p><strong>Status:</strong> ${cert.valid ? 'Valid' : 'Tidak Valid'}</p>
    `;
  } catch (error) {
    alert('Sertifikat tidak ditemukan!');
  }
}

document.getElementById('formSertifikat').addEventListener('submit', terbitkanSertifikat);

window.onload = async function () {
  await loadWeb3();
  await loadContract();
  await tampilkanSertifikat();
};
