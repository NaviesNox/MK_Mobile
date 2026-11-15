<template>
  <div class="space-y-8 text-white">
    
    <div>
      <h1 class="text-2xl font-bold">50/30/20 Budget Allocation</h1>
      <p class="text-[#8F9BB3] mb-6">Simulasikan pembagian pemasukanmu berdasarkan aturan 50% Kebutuhan Pokok, 30% Hobi/Keinginan, dan 20% Investasi/Tabungan.</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Input Section -->
        <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143]">
          <h2 class="text-lg font-semibold mb-4 text-white">Total Pemasukan (Income)</h2>
          <div class="flex items-center space-x-2 mb-6">
            <label class="text-[#8F9BB3] font-medium bg-[#0A0E17] p-2.5 rounded-xl border border-[#2A3143]">Rp</label>
            <input 
              v-model="incomeInput" 
              type="number" 
              min="0"
              class="flex-1 bg-[#0A0E17] border border-[#2A3143] text-white p-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#21CE99] focus:border-[#21CE99] transition" 
              placeholder="Masukkan nominal pemasukan..."
            />
          </div>

          <div class="space-y-4 mb-6">
            <!-- 50% Needs -->
            <div class="border-l-4 border-[#2563EB] bg-[#0A0E17] p-4 rounded-xl">
              <h3 class="font-bold text-[#3B82F6]">50% Kebutuhan Pokok</h3>
              <p class="text-sm text-[#8F9BB3] mb-1">Biaya hidup, tagihan, makanan, cicilan</p>
              <p class="text-xl font-bold text-white">Rp {{ needs.toLocaleString() }}</p>
            </div>
            
            <!-- 30% Wants -->
            <div class="border-l-4 border-[#EC4899] bg-[#0A0E17] p-4 rounded-xl">
              <h3 class="font-bold text-[#F472B6]">30% Hobi & Keinginan</h3>
              <p class="text-sm text-[#8F9BB3] mb-1">Hiburan, belanja, liburan</p>
              <p class="text-xl font-bold text-white">Rp {{ wants.toLocaleString() }}</p>
            </div>
            
            <!-- 20% Savings/Invest -->
            <div class="border-l-4 border-[#21CE99] bg-[#0A0E17] p-4 rounded-xl">
              <h3 class="font-bold text-[#21CE99]">20% Investasi & Tabungan</h3>
              <p class="text-sm text-[#8F9BB3] mb-1">Dana darurat, saham, reksadana</p>
              <p class="text-xl font-bold text-white">Rp {{ investments.toLocaleString() }}</p>
            </div>
          </div>

          <!-- Save to monthly budget -->
          <div class="border-t border-[#2A3143] pt-4">
            <h3 class="font-medium text-white mb-2">Simpan sebagai Catatan Bulanan</h3>
            <div class="flex space-x-2 mb-4">
              <select v-model="selectedMonth" class="bg-[#0A0E17] border border-[#2A3143] text-white p-2 rounded-xl flex-1 focus:outline-none focus:ring-1 focus:ring-[#21CE99]">
                <option v-for="(m, idx) in months" :key="idx" :value="idx + 1">{{ m }}</option>
              </select>
              <input v-model="selectedYear" type="number" class="bg-[#0A0E17] border border-[#2A3143] text-white p-2 rounded-xl w-24 focus:outline-none focus:ring-1 focus:ring-[#21CE99]" placeholder="Year">
            </div>
            <button @click="saveAllocation" class="w-full bg-[#2563EB] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-blue-600 transition shadow-md">
              Simpan Budget
            </button>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-[#151B29] p-6 rounded-2xl shadow-lg border border-[#2A3143] flex flex-col items-center justify-center">
          <h2 class="text-lg font-semibold mb-4 text-white w-full text-left">Visualisasi Budget</h2>
          <div class="w-full max-w-sm">
            <Pie :data="chartData" :options="chartOptions" v-if="incomeInput > 0" />
            <div v-else class="text-center text-[#8F9BB3] py-10">
               Masukkan jumlah pemasukan untuk melihat grafik.
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- History Section -->
    <div class="bg-[#151B29] p-4 md:p-6 rounded-2xl shadow-lg border border-[#2A3143] w-full">
      <h2 class="text-xl font-semibold mb-4 text-white">Riwayat Budget Bulanan</h2>

      <!-- Desktop Table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-[#0A0E17] text-[#8F9BB3] text-sm uppercase tracking-wider">
              <th class="p-3 border-b border-[#2A3143]">Bulan/Tahun</th>
              <th class="p-3 border-b border-[#2A3143]">Total Income</th>
              <th class="p-3 border-b border-[#2A3143] text-[#3B82F6]">50% Pokok</th>
              <th class="p-3 border-b border-[#2A3143] text-[#F472B6]">30% Hobi</th>
              <th class="p-3 border-b border-[#2A3143] text-[#21CE99]">20% Investasi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in budgetHistory" :key="item.id" class="hover:bg-[#1C2436] border-b border-[#2A3143] transition">
              <td class="p-3 font-medium text-[#E2E8F0]">{{ getMonthName(item.month) }} {{ item.year }}</td>
              <td class="p-3 font-bold text-white">Rp {{ item.total.toLocaleString() }}</td>
              <td class="p-3 text-[#3B82F6] font-medium">Rp {{ item.needs.toLocaleString() }}</td>
              <td class="p-3 text-[#F472B6] font-medium">Rp {{ item.wants.toLocaleString() }}</td>
              <td class="p-3 text-[#21CE99] font-medium">Rp {{ item.investments.toLocaleString() }}</td>
            </tr>
            <tr v-if="!budgetHistory.length">
              <td colspan="5" class="p-4 text-center text-[#8F9BB3]">Belum ada catatan budget.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile List View -->
      <div class="block md:hidden space-y-4">
        <div v-for="item in budgetHistory" :key="item.id + '-mobile'" class="border border-[#2A3143] bg-[#0A0E17] rounded-xl p-4 shadow-sm flex flex-col space-y-3">
          <div class="flex justify-between items-center border-b border-[#2A3143] pb-2">
            <span class="font-semibold text-white">{{ getMonthName(item.month) }} {{ item.year }}</span>
            <span class="font-bold text-white text-lg">Rp {{ item.total.toLocaleString() }}</span>
          </div>
          <div class="grid grid-cols-1 gap-2 text-sm">
            <div class="flex justify-between">
              <span class="text-[#3B82F6] font-medium">50% Kebutuhan Pokok</span>
              <span class="font-semibold text-[#E2E8F0]">Rp {{ item.needs.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#F472B6] font-medium">30% Hobi/Keinginan</span>
              <span class="font-semibold text-[#E2E8F0]">Rp {{ item.wants.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-[#21CE99] font-medium">20% Tabungan/Invest</span >
              <span class="font-semibold text-[#E2E8F0]">Rp {{ item.investments.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <div v-if="!budgetHistory.length" class="p-4 text-center text-[#8F9BB3] border border-[#2A3143] rounded-xl bg-[#0A0E17]">
          Belum ada catatan budget.
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const incomeInput = ref(0)

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const currentDate = new Date()
const selectedMonth = ref(currentDate.getMonth() + 1)
const selectedYear = ref(currentDate.getFullYear())
const budgetHistory = ref([])

onMounted(async () => {
    fetchHistory()
    try {
        const res = await api.get('/transactions/')
        const transactions = res.data
        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0)
        
        if (totalIncome > 0) {
            incomeInput.value = totalIncome
        }
    } catch (e) {
        console.error("Failed to fetch default income")
    }
})

const fetchHistory = async () => {
  try {
    const res = await api.get('/budgets/history')
    budgetHistory.value = res.data
  } catch(e) {
    console.error("Failed to fetch history", e)
  }
}

const getMonthName = (m) => months[m - 1]

// Calculations
const needs = computed(() => (incomeInput.value * 0.5) || 0)
const wants = computed(() => (incomeInput.value * 0.3) || 0)
const investments = computed(() => (incomeInput.value * 0.2) || 0)

// Chart configuration
const chartData = computed(() => ({
  labels: ['Kebutuhan Pokok', 'Hobi/Keinginan', 'Investasi'],
  datasets: [
    {
      backgroundColor: ['#2563EB', '#F472B6', '#21CE99'], 
      borderWidth: 0,
      data: [needs.value, wants.value, investments.value]
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  color: '#8F9BB3',
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#8F9BB3' }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          let label = context.label || '';
          if (label) {
            label += ': Rp ';
          }
          if (context.parsed !== null) {
            label += context.parsed.toLocaleString();
          }
          return label;
        }
      }
    }
  }
}


const saveAllocation = async () => {
  if (incomeInput.value <= 0) {
    alert("Masukkan jumlah pemasukan terlebih dahulu.")
    return
  }
  
  try {
    await api.post('/budgets/allocate', {
      income: incomeInput.value,
      month: selectedMonth.value,
      year: selectedYear.value
    })
    alert('Catatan budget bulanan berhasil disimpan!')
    fetchHistory()
  } catch(e) {
    alert('Gagal menyimpan budget.')
  }
}
</script>