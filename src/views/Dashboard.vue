<template>
  <div class="space-y-8 text-white">
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-[#8F9BB3] mb-4 md:mb-0">Overview & Ringkasan Keuangan Anda</p>
      </div>
      
      <!-- Period Selector -->
      <div class="bg-[#151B29] border border-[#2A3143] rounded-xl p-1 inline-flex">
        <select v-model="selectedPeriod" class="bg-transparent text-white text-sm font-medium focus:outline-none focus:ring-0 px-3 py-2 cursor-pointer appearance-none">
          <option value="this_month">Bulan Ini</option>
          <option value="last_month">Bulan Lalu</option>
          <option value="last_3_months">3 Bulan Terakhir</option>
          <option value="this_year">Tahun Ini</option>
          <option value="all_time">Semua Waktu</option>
        </select>
        <div class="pointer-events-none flex items-center px-2 text-[#8F9BB3]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143] border-l-4 border-l-[#2563EB]">
        <h2 class="text-sm font-medium text-[#8F9BB3]">Total Saldo Saat Ini</h2>
        <p class="text-2xl mt-2 font-bold text-white">Rp {{ totalBalance.toLocaleString() }}</p>
      </div>
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143] border-l-4 border-l-[#21CE99]">
        <h2 class="text-sm font-medium text-[#8F9BB3]">Pemasukan (Periode Terpilih)</h2>
        <p class="text-2xl mt-2 font-bold text-[#21CE99]">Rp {{ totalIncome.toLocaleString() }}</p>
      </div>
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143] border-l-4 border-l-[#F45532]">
        <h2 class="text-sm font-medium text-[#8F9BB3]">Pengeluaran (Periode Terpilih)</h2>
        <p class="text-2xl mt-2 font-bold text-[#F45532]">Rp {{ totalExpense.toLocaleString() }}</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Bar Chart: Income vs Expense -->
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143]">
        <h2 class="text-lg font-semibold mb-4 text-white">Pemasukan vs Pengeluaran</h2>
        <div class="relative h-64">
           <Bar v-if="transactionsLoaded" :data="barChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Doughnut Chart: Expense by Category -->
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143]">
        <h2 class="text-lg font-semibold mb-4 text-white">Pengeluaran per Kategori</h2>
        <div class="relative h-64 flex justify-center">
           <Doughnut v-if="transactionsLoaded" :data="doughnutChartData" :options="chartOptions" />
           <p v-if="!hasExpenses" class="flex items-center text-[#8F9BB3] absolute inset-0 justify-center">Belum ada pengeluaran</p>
        </div>
      </div>
    </div>

    <!-- Wallets Breakdown -->
    <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143]">
       <h2 class="text-lg font-semibold mb-4 text-white">Rincian Dompet</h2>
       <div v-if="wallets.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="wallet in wallets" :key="wallet.id" class="p-4 rounded-xl bg-[#0A0E17] border border-[#2A3143] transition hover:border-[#2563EB]">
          <h3 class="font-bold text-white">{{ wallet.name }}</h3>
          <p class="text-[#8F9BB3] text-sm mb-2">{{ wallet.type }}</p>
          <p class="text-lg font-bold text-white">Rp {{ wallet.balance.toLocaleString() }}</p>
        </div>
      </div>
      <div v-else class="text-[#8F9BB3]">
        Belum ada dompet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const wallets = ref([])
const transactions = ref([])
const categories = ref([])
const transactionsLoaded = ref(false)

const selectedPeriod = ref('this_month')

onMounted(async () => {
  try {
    const [walletsRes, transRes, catsRes] = await Promise.all([
      api.get('/wallets/'),
      api.get('/transactions/'),
      api.get('/categories/')
    ])
    wallets.value = walletsRes.data
    transactions.value = transRes.data
    categories.value = catsRes.data
    transactionsLoaded.value = true
  } catch (error) {
    console.error('Failed to fetch dashboard data', error)
  }
})

const getCategoryName = (id) => {
  if (!id) return 'Uncategorized'
  const cat = categories.value.find(c => c.id === id)
  return cat ? cat.name : 'Uncategorized'
}

const currentPeriodTransactions = computed(() => {
  const now = new Date()
  
  return transactions.value.filter(t => {
    const d = new Date(t.date)
    
    if (selectedPeriod.value === 'this_month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    } 
    else if (selectedPeriod.value === 'last_month') {
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear()
    }
    else if (selectedPeriod.value === 'last_3_months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      return d >= threeMonthsAgo && d <= now
    }
    else if (selectedPeriod.value === 'this_year') {
      return d.getFullYear() === now.getFullYear()
    }
    
    // all_time
    return true
  })
})

const totalIncome = computed(() => {
  return currentPeriodTransactions.value
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpense = computed(() => {
  return currentPeriodTransactions.value
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalBalance = computed(() => {
  return wallets.value.reduce((sum, w) => sum + w.balance, 0)
})

const barChartData = computed(() => {
  return {
    labels: ['Pemasukan', 'Pengeluaran'],
    datasets: [
      {
        label: 'Total Rupiah',
        backgroundColor: ['#21CE99', '#F45532'],
        data: [totalIncome.value, totalExpense.value]
      }
    ]
  }
})

const hasExpenses = computed(() => totalExpense.value > 0)

const doughnutChartData = computed(() => {
  const expenses = currentPeriodTransactions.value.filter(t => t.type === 'EXPENSE')
  const expenseByCat = {}
  
  expenses.forEach(t => {
    const catName = getCategoryName(t.category_id)
    if (!expenseByCat[catName]) expenseByCat[catName] = 0
    expenseByCat[catName] += t.amount
  })

  // fallback if empty
  if (Object.keys(expenseByCat).length === 0) {
     return { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#2A3143'], borderWidth: 0 }] }
  }

  return {
    labels: Object.keys(expenseByCat),
    datasets: [
      {
        backgroundColor: ['#2563EB', '#8B5CF6', '#EC4899', '#F45532', '#F59E0B', '#21CE99', '#3B82F6', '#14B8A6', '#6366F1'],
        borderWidth: 0,
        data: Object.values(expenseByCat)
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: '#8F9BB3',
  scales: {
    x: {
      ticks: { color: '#8F9BB3' },
      grid: { color: '#2A3143' }
    },
    y: {
      ticks: { color: '#8F9BB3' },
      grid: { color: '#2A3143' }
    }
  },
  plugins: {
    legend: {
      labels: { color: '#8F9BB3' }
    }
  }
}
</script>
