<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-white tracking-tight">Kalkulator Finansial</h1>
      <p class="text-[#8F9BB3] mt-1 text-sm">Hitung simulasi tabungan, investasi, dan cicilan pinjaman Anda.</p>
    </div>

    <!-- Tabs/Navigation for Calculator Types -->
    <div class="flex space-x-2 border-b border-[#2A3143] pb-2 overflow-x-auto no-scrollbar">
      <button 
        @click="activeTab = 'savings'"
        :class="activeTab === 'savings' ? 'bg-[#21CE99] text-[#0A0E17]' : 'bg-[#151B29] text-[#8F9BB3] hover:text-white'"
        class="px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
      >
        Target Tabungan
      </button>
      <button 
        @click="activeTab = 'investment'"
        :class="activeTab === 'investment' ? 'bg-[#21CE99] text-[#0A0E17]' : 'bg-[#151B29] text-[#8F9BB3] hover:text-white'"
        class="px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
      >
        Bunga Majemuk (Investasi)
      </button>
      <button 
        @click="activeTab = 'loan'"
        :class="activeTab === 'loan' ? 'bg-[#21CE99] text-[#0A0E17]' : 'bg-[#151B29] text-[#8F9BB3] hover:text-white'"
        class="px-4 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
      >
        Cicilan Pinjaman
      </button>
    </div>

    <!-- 1. Target Tabungan Calculator -->
    <div v-if="activeTab === 'savings'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-sm border border-[#2A3143]">
        <h2 class="text-xl font-bold text-white mb-4">Hitung Target</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Target Dana yang Ingin Dicapai (Rp)</label>
            <input v-model="savings.target" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Contoh: 50000000">
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Saldo Awal Saat Ini (Rp)</label>
            <input v-model="savings.initial" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Contoh: 1000000">
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Waktu Tersedia (Bulan)</label>
            <input v-model="savings.months" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Contoh: 12">
          </div>
        </div>
      </div>
      <div class="bg-[#1C2436] p-6 rounded-2xl shadow-sm border border-[#2A3143] flex flex-col justify-center items-center text-center">
        <p class="text-[#8F9BB3] mb-2 font-medium">Berdasarkan data Anda, Anda perlu menabung sebesar:</p>
        <h3 class="text-4xl font-bold tracking-tight text-[#21CE99] my-2">Rp {{ calculateSavings.toLocaleString() }}</h3>
        <p class="text-[#8F9BB3]">Per bulan selama {{ savings.months || 0 }} bulan</p>
        
        <div v-if="calculateSavings > 0" class="mt-6 bg-[#0A0E17] p-4 rounded-xl border border-[#2A3143] w-full text-left">
          <p class="text-sm text-white mb-1"><strong>Analisa Singkat:</strong></p>
          <p class="text-xs text-[#8F9BB3]">
            Total Kekurangan: Rp {{ Math.max((savings.target || 0) - (savings.initial || 0), 0).toLocaleString() }}. <br/>
            Jika Anda bisa komitmen menabung sejumlah di atas setiap bulannya, target Anda akan tercapai tepat waktu pada bulan ke-{{ savings.months || 0 }}.
          </p>
        </div>
      </div>
    </div>

    <!-- 2. Bunga Majemuk (Investasi) -->
    <div v-if="activeTab === 'investment'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-sm border border-[#2A3143]">
        <h2 class="text-xl font-bold text-white mb-4">Investasi Bunga Majemuk</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Modal Awal (Rp)</label>
            <input v-model="investment.initial" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="0">
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Tambahan Rutin Per Bulan (Rp)</label>
            <input v-model="investment.monthly" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="0">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Bunga Per Tahun (%)</label>
              <input v-model="investment.ratePercent" type="number" step="0.1" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Cth: 6">
            </div>
            <div>
              <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Durasi (Tahun)</label>
              <input v-model="investment.years" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99]" placeholder="Cth: 5">
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[#1C2436] p-6 rounded-2xl shadow-sm border border-[#2A3143] flex flex-col justify-center items-center text-center">
        <p class="text-[#8F9BB3] mb-2 font-medium">Estimasi Hasil Investasi di Akhir Tahun ke-{{ investment.years || 0 }}:</p>
        <h3 class="text-4xl font-bold tracking-tight text-[#21CE99] my-2">Rp {{ calculateInvestment.total.toLocaleString() }}</h3>
        
        <div class="mt-6 w-full text-sm flex justify-between px-2 text-[#E2E8F0]">
           <span>Total Modal Anda</span>
           <span class="font-bold">Rp {{ calculateInvestment.principal.toLocaleString() }}</span>
        </div>
        <div class="w-full text-sm flex justify-between px-2 mt-2 text-[#21CE99]">
           <span>Keuntungan Bunga (Return)</span>
           <span class="font-bold">+ Rp {{ calculateInvestment.interest.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- 3. Cicilan Pinjaman Calculator -->
    <div v-if="activeTab === 'loan'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-[#151B29] p-6 rounded-2xl shadow-sm border border-[#2A3143]">
        <h2 class="text-xl font-bold text-white mb-4">Simulasi Cicilan Tetap</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Jumlah Pinjaman (Rp)</label>
            <input v-model="loan.principal" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#F45532]" placeholder="Contoh: 100000000">
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Bunga Tetap Per Tahun (%)</label>
            <input v-model="loan.ratePercent" type="number" step="0.1" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#F45532]" placeholder="Contoh: 10">
          </div>
          <div>
            <label class="block text-sm font-medium text-[#8F9BB3] mb-1">Tenor (Bulan)</label>
            <input v-model="loan.months" type="number" class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#F45532]" placeholder="Contoh: 12">
          </div>
        </div>
      </div>
      <div class="bg-[#1C2436] p-6 rounded-2xl shadow-sm border border-[#2A3143] flex flex-col justify-center items-center text-center">
        <p class="text-[#8F9BB3] mb-2 font-medium">Cicilan Bulanan Anda adalah:</p>
        <h3 class="text-4xl font-bold tracking-tight text-[#F45532] my-2">Rp {{ calculateLoan.monthlyPayment.toLocaleString() }}</h3>
        
        <div class="mt-6 w-full text-sm flex justify-between px-2 text-[#E2E8F0]">
           <span>Total Pinjaman + Bunga</span>
           <span class="font-bold">Rp {{ calculateLoan.totalPayment.toLocaleString() }}</span>
        </div>
        <div class="mt-2 w-full text-sm flex justify-between px-2 text-[#F45532]">
           <span>Total Bunga yang Dibayar</span>
           <span class="font-bold">Rp {{ calculateLoan.totalInterest.toLocaleString() }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('savings')

// Data target tabungan
const savings = ref({
  target: 0,
  initial: 0,
  months: 1
})

// Data investasi
const investment = ref({
  initial: 0,
  monthly: 0,
  ratePercent: 5,
  years: 5
})

// Data cicilan
const loan = ref({
  principal: 0,
  ratePercent: 10,
  months: 12
})

// === Logika Kalkulator Tabungan ===
const calculateSavings = computed(() => {
  const target = parseFloat(savings.value.target) || 0
  const initial = parseFloat(savings.value.initial) || 0
  const months = parseFloat(savings.value.months) || 1
  
  const remain = target - initial
  if (remain <= 0) return 0
  if (months <= 0) return remain
  
  return Math.ceil(remain / months)
})

// === Logika Bunga Majemuk ===
const calculateInvestment = computed(() => {
  const p = parseFloat(investment.value.initial) || 0
  const monthlyCont = parseFloat(investment.value.monthly) || 0
  const r = (parseFloat(investment.value.ratePercent) || 0) / 100 / 12 // Rate per bulan
  const n = (parseFloat(investment.value.years) || 0) * 12 // Total bulan
  
  let total = p
  for (let i = 0; i < n; i++) {
    total = (total + monthlyCont) * (1 + r)
  }
  
  const principal = p + (monthlyCont * n)
  const interest = total - principal
  
  return {
    total: Math.round(total),
    principal: Math.round(principal),
    interest: Math.round(interest)
  }
})

// === Logika Pinjaman (Cicilan Fixed/Flat) ===
const calculateLoan = computed(() => {
  const P = parseFloat(loan.value.principal) || 0
  const r = (parseFloat(loan.value.ratePercent) || 0) / 100 / 12 // Rate per bulan
  const n = parseFloat(loan.value.months) || 1
  
  let monthlyPayment = 0
  if (P > 0 && n > 0) {
     if (r === 0) {
        monthlyPayment = P / n
     } else {
        // Amortization formula: M = P [ r(1 + r)^n ] / [ (1 + r)^n - 1]
        monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
     }
  }
  
  const totalPayment = monthlyPayment * n
  const totalInterest = totalPayment - P
  
  return {
    monthlyPayment: Math.round(monthlyPayment) || 0,
    totalPayment: Math.round(totalPayment) || 0,
    totalInterest: Math.round(totalInterest) || 0
  }
})
</script>