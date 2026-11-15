<template>
  <div class="space-y-8 text-white">
    <div>
      <h1 class="text-2xl font-bold">Transactions</h1>
      <p class="text-[#8F9BB3] mb-6">Kelola seluruh riwayat arus kas, catat pengeluaran, serta pemasukan harianmu.</p>
    
      <!-- Add Transaction Form -->
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143]">
        <h2 class="text-lg font-semibold mb-4 text-white">Add New Transaction</h2>
        <form @submit.prevent="addTransaction" class="space-y-4">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Type</label>
              <select v-model="form.type" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#21CE99] focus:border-[#21CE99] transition" required>
                <option value="INCOME">Income (Pemasukan)</option>
                <option value="EXPENSE">Expense (Pengeluaran)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Amount</label>
              <div class="flex items-center space-x-2">
                <span class="text-[#8F9BB3] font-medium bg-[#0A0E17] p-2.5 rounded-xl border border-[#2A3143]">Rp</span>
                <input v-model="form.amount" type="number" min="0" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#21CE99] focus:border-[#21CE99] transition" required placeholder="0">
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Wallet</label>
              <select v-model="form.wallet_id" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#21CE99] focus:border-[#21CE99] transition" required>
                <option value="" disabled>Select Wallet</option>
                <option v-for="wallet in wallets" :key="wallet.id" :value="wallet.id">{{ wallet.name }} - Rp {{ wallet.balance.toLocaleString() }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Category (Optional)</label>
              <select v-model="form.category_id" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#21CE99] focus:border-[#21CE99] transition">
                <option value="">None</option>
                <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
          </div>

          <div>
             <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Description</label>
             <input v-model="form.description" type="text" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#21CE99] focus:border-[#21CE99] transition" required placeholder="Brief description..">
          </div>

          <div class="pt-4">
            <button type="submit" class="w-full sm:w-auto bg-[#2563EB] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition duration-150 shadow-md">
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Transactions List & Filter -->
    <div class="bg-[#151B29] p-4 md:p-6 rounded-2xl shadow-lg border border-[#2A3143] w-full">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
        <h2 class="text-xl font-semibold text-white">Riwayat Transaksi</h2>
        <button @click="showFilters = !showFilters" class="bg-[#2A3143] hover:bg-[#363F54] text-white px-4 py-2 rounded-xl text-sm font-medium transition flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>{{ showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter' }}</span>
        </button>
      </div>

      <!-- Filter Box -->
      <div v-if="showFilters" class="bg-[#0A0E17] border border-[#2A3143] p-4 rounded-xl mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Date Filter -->
        <div>
          <label class="block text-xs font-medium text-[#8F9BB3] mb-1">Mulai Tanggal</label>
          <input v-model="listFilters.startDate" type="date" class="w-full bg-[#151B29] border border-[#2A3143] text-white p-2 rounded-lg focus:outline-none focus:border-[#21CE99] text-sm">
        </div>
        <div>
          <label class="block text-xs font-medium text-[#8F9BB3] mb-1">Sampai Tanggal</label>
          <input v-model="listFilters.endDate" type="date" class="w-full bg-[#151B29] border border-[#2A3143] text-white p-2 rounded-lg focus:outline-none focus:border-[#21CE99] text-sm">
        </div>
        
        <!-- Category Filter -->
        <div>
          <label class="block text-xs font-medium text-[#8F9BB3] mb-1">Kategori</label>
          <select v-model="listFilters.categoryId" class="w-full bg-[#151B29] border border-[#2A3143] text-white p-2 rounded-lg focus:outline-none focus:border-[#21CE99] text-sm">
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }} ({{ cat.type }})</option>
          </select>
        </div>

        <!-- Amount Filter -->
        <div>
          <label class="block text-xs font-medium text-[#8F9BB3] mb-1">Min. Nominal (Rp)</label>
          <input v-model="listFilters.minAmount" type="number" min="0" placeholder="0" class="w-full bg-[#151B29] border border-[#2A3143] text-white p-2 rounded-lg focus:outline-none focus:border-[#21CE99] text-sm">
        </div>
        <div>
          <label class="block text-xs font-medium text-[#8F9BB3] mb-1">Maks. Nominal (Rp)</label>
          <input v-model="listFilters.maxAmount" type="number" min="0" placeholder="Tak terhingga" class="w-full bg-[#151B29] border border-[#2A3143] text-white p-2 rounded-lg focus:outline-none focus:border-[#21CE99] text-sm">
        </div>
        <div class="flex items-end justify-end">
          <button @click="resetFilters" class="text-[#F45532] hover:text-white text-sm font-medium transition py-2 px-3 border border-[#F45532]/30 rounded-lg hover:bg-[#F45532]/20">Reset Filter</button>
        </div>
      </div>
      
      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-[#0A0E17] text-[#8F9BB3] text-sm uppercase tracking-wider">
              <th class="p-3 border-b border-[#2A3143]">Date</th>
              <th class="p-3 border-b border-[#2A3143]">Type</th>
              <th class="p-3 border-b border-[#2A3143]">Category</th>
              <th class="p-3 border-b border-[#2A3143]">Description</th>
              <th class="p-3 border-b border-[#2A3143] text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trx in filteredTransactions" :key="trx.id" class="hover:bg-[#1C2436] border-b border-[#2A3143] transition">
              <td class="p-3 text-[#E2E8F0]">{{ new Date(trx.date).toLocaleDateString() }}</td>
              <td class="p-3 font-semibold" :class="trx.type === 'INCOME' ? 'text-[#21CE99]' : 'text-[#F45532]'">
                {{ trx.type }}
              </td>
              <td class="p-3 text-[#E2E8F0]">{{ getCategoryName(trx.category_id) }}</td>
              <td class="p-3 text-[#8F9BB3]">{{ trx.description }}</td>
              <td class="p-3 text-right font-bold" :class="trx.type === 'INCOME' ? 'text-[#21CE99]' : 'text-[#F45532]'">
                 {{ trx.type === 'INCOME' ? '+' : '-' }} Rp {{ trx.amount.toLocaleString() }}
              </td>
            </tr>
            <tr v-if="!filteredTransactions.length">
              <td colspan="5" class="p-4 text-center text-[#8F9BB3]">
                {{ transactions.length ? 'Tidak ada transaksi yang sesuai filter.' : 'No transactions recorded yet.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List View -->
      <div class="block md:hidden space-y-4">
        <div v-for="trx in filteredTransactions" :key="trx.id + '-mobile'" class="border border-[#2A3143] bg-[#0A0E17] rounded-xl p-4 shadow-sm flex flex-col space-y-2">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm text-[#8F9BB3] font-medium">{{ new Date(trx.date).toLocaleDateString() }}</p>
              <p class="text-white font-semibold">{{ trx.description || 'Tidak ada deskripsi' }}</p>
            </div>
            <span class="font-bold text-lg" :class="trx.type === 'INCOME' ? 'text-[#21CE99]' : 'text-[#F45532]'">
               {{ trx.type === 'INCOME' ? '+' : '-' }} Rp{{ trx.amount.toLocaleString() }}
            </span>
          </div>
          <div class="flex justify-between text-sm pt-2 border-t border-[#2A3143]">
            <span class="text-[#8F9BB3]">Cat: <span class="font-medium text-[#E2E8F0]">{{ getCategoryName(trx.category_id) }}</span></span>
            <span class="font-bold px-2 py-0.5 rounded text-xs" :class="trx.type === 'INCOME' ? 'bg-[#1C2436] text-[#21CE99]' : 'bg-[#1C2436] text-[#F45532]'">
              {{ trx.type }}
            </span>
          </div>
        </div>
        <div v-if="!filteredTransactions.length" class="p-4 text-center text-[#8F9BB3] border border-[#2A3143] rounded-xl bg-[#0A0E17]">
          {{ transactions.length ? 'Tidak ada transaksi yang sesuai filter.' : 'No transactions recorded yet.' }}
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'

const form = ref({
  type: 'EXPENSE',
  amount: null,
  wallet_id: '',
  category_id: '',
  description: ''
})

const wallets = ref([])
const categories = ref([])
const transactions = ref([])

const showFilters = ref(false)
const listFilters = ref({
  startDate: '',
  endDate: '',
  categoryId: '',
  minAmount: null,
  maxAmount: null
})

const resetFilters = () => {
  listFilters.value = {
    startDate: '',
    endDate: '',
    categoryId: '',
    minAmount: null,
    maxAmount: null
  }
}

const filteredCategories = computed(() => {
  return categories.value.filter(cat => cat.type === form.value.type || cat.type === 'BOTH')
})

const filteredTransactions = computed(() => {
  return transactions.value.filter(trx => {
    let isValid = true;
    
    // Filter Kategori
    if (listFilters.value.categoryId !== '' && listFilters.value.categoryId !== null) {
      if (trx.category_id !== listFilters.value.categoryId) isValid = false;
    }
    
    // Filter Tanggal (Mulai)
    if (listFilters.value.startDate) {
      const trxDate = new Date(trx.date);
      const startDate = new Date(listFilters.value.startDate);
      startDate.setHours(0,0,0,0);
      if (trxDate < startDate) isValid = false;
    }

    // Filter Tanggal (Sampai)
    if (listFilters.value.endDate) {
      const trxDate = new Date(trx.date);
      const endDate = new Date(listFilters.value.endDate);
      endDate.setHours(23,59,59,999);
      if (trxDate > endDate) isValid = false;
    }

    // Filter Nominal (Min)
    if (listFilters.value.minAmount !== null && listFilters.value.minAmount !== '') {
      if (trx.amount < listFilters.value.minAmount) isValid = false;
    }

    // Filter Nominal (Max)
    if (listFilters.value.maxAmount !== null && listFilters.value.maxAmount !== '') {
      if (trx.amount > listFilters.value.maxAmount) isValid = false;
    }

    return isValid;
  })
})

const fetchData = async () => {
  try {
    const [walletsRes, categoriesRes, transactionsRes] = await Promise.all([
      api.get('/wallets/'),
      api.get('/categories/'),
      api.get('/transactions/')
    ])
    wallets.value = walletsRes.data
    categories.value = categoriesRes.data
    transactions.value = transactionsRes.data.sort((a,b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('Error fetching data')
  }
}

onMounted(() => {
  fetchData()
})

const getCategoryName = (id) => {
  if (!id) return '-'
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : '-'
}

const addTransaction = async () => {
  try {
    let payload = {
      type: form.value.type,
      amount: form.value.amount,
      wallet_id: form.value.wallet_id,
      description: form.value.description
    }

    if(form.value.category_id !== '') {
        payload.category_id = form.value.category_id
    }

    await api.post('/transactions/', payload)
    
    // Reset Form
    form.value.amount = null
    form.value.description = ''
    form.value.category_id = ''
    
    // Refresh Data (to update wallets and transaction list)
    fetchData()
  } catch (err) {
    alert('Failed to save transaction')
  }
}
</script>
