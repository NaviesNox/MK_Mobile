<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white tracking-tight">Kategori & Sumber Dana</h1>
      <p class="text-[#8F9BB3] mt-1 text-sm">Kelola pilihan kategori transaksi dan dompet (sumber dana) Anda.</p>
    </div>

    <!-- Layout Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Wallet Management -->
      <div class="bg-[#151B29] rounded-2xl shadow-sm border border-[#2A3143] overflow-hidden">
        <div class="p-6 border-b border-[#2A3143] flex justify-between items-center bg-[#1A2235]">
          <div>
            <h2 class="text-xl font-bold text-white mb-1">Sumber Dana (Wallet)</h2>
            <p class="text-sm text-[#8F9BB3]">Kelola rekening & dompet</p>
          </div>
          <button @click="openWalletModal()" class="bg-[#21CE99] text-[#0A0E17] px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1db989] transition shadow">
            + Tambah
          </button>
        </div>
        
        <div class="p-4 space-y-3">
          <div v-if="wallets.length === 0" class="text-center text-[#8F9BB3] py-6">
            Belum ada sumber dana.
          </div>
          <div v-for="w in wallets" :key="w.id" class="flex justify-between items-center p-4 bg-[#0A0E17] rounded-xl border border-[#2A3143]">
            <div>
              <div class="font-bold text-white">{{ w.name }}</div>
              <div class="text-xs text-[#8F9BB3] bg-[#1A2235] px-2 py-0.5 rounded-md inline-block mt-1">{{ w.type }}</div>
            </div>
            <div class="flex space-x-2">
              <button @click="openWalletModal(w)" class="text-[#8F9BB3] hover:text-[#21CE99] p-2 rounded-lg bg-[#1A2235] hover:bg-[#1A2235]/80 transition">
                Edit
              </button>
              <button @click="deleteWallet(w.id)" class="text-[#8F9BB3] hover:text-[#F45532] p-2 rounded-lg bg-[#1A2235] hover:bg-[#1A2235]/80 transition">
                Hapus
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Category Management -->
      <div class="bg-[#151B29] rounded-2xl shadow-sm border border-[#2A3143] overflow-hidden">
        <div class="p-6 border-b border-[#2A3143] flex justify-between items-center bg-[#1A2235]">
          <div>
            <h2 class="text-xl font-bold text-white mb-1">Kategori Transaksi</h2>
            <p class="text-sm text-[#8F9BB3]">Kelola jenis pengeluaran & pemasukan</p>
          </div>
          <button @click="openCategoryModal()" class="bg-[#0A0E17] border border-[#2A3143] text-white px-4 py-2 rounded-xl text-sm font-bold hover:border-[#21CE99] hover:text-[#21CE99] transition shadow">
            + Tambah
          </button>
        </div>
        
        <div class="p-4 space-y-3">
          <div v-if="categories.length === 0" class="text-center text-[#8F9BB3] py-6">
            Belum ada kategori.
          </div>
          <div v-for="c in categories" :key="c.id" class="flex justify-between items-center p-4 bg-[#0A0E17] rounded-xl border border-[#2A3143]">
            <div class="flex items-center space-x-3">
              <div :class="[c.type === 'INCOME' ? 'bg-[#21CE99]/10 text-[#21CE99]' : 'bg-[#F45532]/10 text-[#F45532]', 'p-2 rounded-lg font-bold text-sm']">
                {{ c.type === 'INCOME' ? 'IN' : 'OUT' }}
              </div>
              <div class="font-bold text-white">{{ c.name }}</div>
            </div>
            <div class="flex space-x-2">
              <button @click="openCategoryModal(c)" class="text-[#8F9BB3] hover:text-[#21CE99] p-2 rounded-lg bg-[#1A2235] hover:bg-[#1A2235]/80 transition">
                Edit
              </button>
              <button @click="deleteCategory(c.id)" class="text-[#8F9BB3] hover:text-[#F45532] p-2 rounded-lg bg-[#1A2235] hover:bg-[#1A2235]/80 transition">
                Hapus
              </button>
            </div>
          </div>

          <div class="bg-[#151B29] rounded-2xl shadow-sm border border-[#2A3143] overflow-hidden">
            <div class="p-6 border-b border-[#2A3143] bg-[#1A2235]">
              <h2 class="text-xl font-bold text-white mb-1">Cadangkan Data</h2>
              <p class="text-sm text-[#8F9BB3]">Export data ke file JSON untuk dipindahkan ke perangkat lain, atau import file cadangan.</p>
            </div>
            <div class="p-6 flex flex-col sm:flex-row gap-3">
              <button @click="exportData" class="bg-[#2563EB] text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-600 transition">
                Export Data
              </button>
              <label class="bg-[#2A3143] text-white px-5 py-3 rounded-xl font-bold hover:bg-[#363F54] transition text-center cursor-pointer">
                Import Data
                <input type="file" accept="application/json,.json" class="hidden" @change="importData">
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Modal -->
    <div v-if="showWalletModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#151B29] border border-[#2A3143] p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <h3 class="text-xl font-bold text-white mb-4">{{ walletForm.id ? 'Edit' : 'Tambah' }} Sumber Dana</h3>
        <form @submit.prevent="saveWallet">
          <div class="mb-4">
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Nama Dompet (cth: BCA, OVO)</label>
            <input v-model="walletForm.name" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Masukkan nama...">
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Jenis</label>
            <select v-model="walletForm.type" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99] appearance-none">
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
              <option value="E-Wallet">E-Wallet</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showWalletModal = false" class="px-4 py-2 text-[#8F9BB3] hover:text-white transition">Batal</button>
            <button type="submit" class="bg-[#21CE99] text-[#0A0E17] px-6 py-2 rounded-xl font-bold hover:bg-[#1db989] shadow-md transition">Simpan</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#151B29] border border-[#2A3143] p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <h3 class="text-xl font-bold text-white mb-4">{{ categoryForm.id ? 'Edit' : 'Tambah' }} Kategori</h3>
        <form @submit.prevent="saveCategory">
          <div class="mb-4">
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Nama Kategori</label>
            <input v-model="categoryForm.name" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Cth: Makanan, Gaji...">
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Tipe</label>
            <select v-model="categoryForm.type" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99] appearance-none">
              <option value="INCOME">Pemasukan (INCOME)</option>
              <option value="EXPENSE">Pengeluaran (EXPENSE)</option>
            </select>
          </div>
          <div class="flex justify-end space-x-3">
            <button type="button" @click="showCategoryModal = false" class="px-4 py-2 text-[#8F9BB3] hover:text-white transition">Batal</button>
            <button type="submit" class="bg-[#21CE99] text-[#0A0E17] px-6 py-2 rounded-xl font-bold hover:bg-[#1db989] shadow-md transition">Simpan</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { readData, writeData } from '../services/api'
import { Capacitor } from '@capacitor/core'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'

// State
const wallets = ref([])
const categories = ref([])

// Modals
const showWalletModal = ref(false)
const showCategoryModal = ref(false)

// Forms
const walletForm = ref({ id: null, name: '', type: 'Cash' })
const categoryForm = ref({ id: null, name: '', type: 'EXPENSE' })

// Fetch Data
const fetchData = async () => {
  try {
    const resW = await api.get('/wallets/')
    wallets.value = resW.data
    const resC = await api.get('/categories/')
    categories.value = resC.data
  } catch (err) {
    console.error(err)
  }
}

// Wallet Handlers
const openWalletModal = (wallet = null) => {
  if (wallet) {
    walletForm.value = { ...wallet }
  } else {
    walletForm.value = { id: null, name: '', type: 'Cash' }
  }
  showWalletModal.value = true
}

const saveWallet = async () => {
  try {
    if (walletForm.value.id) {
      await api.put(`/wallets/${walletForm.value.id}`, {
        name: walletForm.value.name,
        type: walletForm.value.type
      })
    } else {
      await api.post('/wallets/', {
        name: walletForm.value.name,
        type: walletForm.value.type
      })
    }
    showWalletModal.value = false
    fetchData()
  } catch (err) {
    alert('Gagal menyimpan sumber dana')
  }
}

const deleteWallet = async (id) => {
  if (confirm('Yakin ingin menghapus sumber dana ini? Transaksi terkait mungkin terpengaruh.')) {
    try {
      await api.delete(`/wallets/${id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus sumber dana. Pastikan tidak ada transaksi yang terhubung.')
    }
  }
}

// Category Handlers
const openCategoryModal = (category = null) => {
  if (category) {
    categoryForm.value = { ...category }
  } else {
    categoryForm.value = { id: null, name: '', type: 'EXPENSE' }
  }
  showCategoryModal.value = true
}

const saveCategory = async () => {
  try {
    if (categoryForm.value.id) {
      await api.put(`/categories/${categoryForm.value.id}`, {
        name: categoryForm.value.name,
        type: categoryForm.value.type
      })
    } else {
      await api.post('/categories/', {
        name: categoryForm.value.name,
        type: categoryForm.value.type
      })
    }
    showCategoryModal.value = false
    fetchData()
  } catch (err) {
    alert('Gagal menyimpan kategori')
  }
}

const deleteCategory = async (id) => {
  if (confirm('Yakin ingin menghapus kategori ini?')) {
    try {
      await api.delete(`/categories/${id}`)
      fetchData()
    } catch (err) {
      alert('Gagal menghapus kategori. Pastikan tidak ada transaksi yang terhubung.')
    }
  }

  const exportData = async () => {
    const contents = JSON.stringify({
      app: 'MK_Mobile',
      version: 1,
      exportedAt: new Date().toISOString(),
      ...readData()
    }, null, 2)

    if (Capacitor.isNativePlatform()) {
      try {
        const fileName = `mk-mobile-backup-${new Date().toISOString().slice(0, 10)}.json`
        const file = await Filesystem.writeFile({
          path: fileName,
          data: contents,
          directory: Directory.Documents,
          encoding: Encoding.UTF8
        })
        await Share.share({
          title: 'Backup MK Mobile',
          text: 'Backup data MK Mobile',
          url: file.uri,
          dialogTitle: 'Bagikan backup MK Mobile'
        })
      } catch (error) {
        console.error(error)
        alert('Backup gagal dibuat atau dibagikan.')
      }
      return
    }

    const blob = new Blob([contents], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `mk-mobile-backup-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const imported = JSON.parse(await file.text())
      if (!Array.isArray(imported.wallets) || !Array.isArray(imported.categories) ||
          !Array.isArray(imported.transactions) || !Array.isArray(imported.budgets)) {
        throw new Error('Format backup tidak lengkap')
      }
      if (!confirm('Import akan mengganti seluruh data lokal saat ini. Lanjutkan?')) return
      writeData({
        wallets: imported.wallets,
        categories: imported.categories,
        transactions: imported.transactions,
        budgets: imported.budgets
      })
      await fetchData()
      alert('Data berhasil diimport.')
    } catch (error) {
      console.error(error)
      alert('File import tidak valid atau rusak.')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>