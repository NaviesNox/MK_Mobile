<template>
  <div class="min-h-screen bg-[#0A0E17] text-white flex flex-col font-sans">
    <!-- Navbar -->
    <nav class="bg-[#151B29] px-4 py-3 text-white border-b border-[#2A3143] shadow-md relative z-20">
      <div class="flex justify-between items-center max-w-7xl mx-auto">
        <div class="text-xl font-bold flex items-center space-x-2 tracking-tight">
          <span class="text-[#21CE99]">MK</span><span> Mobile</span>
        </div>
        
        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-6 text-sm">
          <router-link to="/" class="hover:text-[#21CE99] font-medium transition">Dashboard</router-link>
          <router-link to="/transactions" class="hover:text-[#21CE99] font-medium transition">Transactions</router-link>
          <router-link to="/budget" class="hover:text-[#21CE99] font-medium transition">Budget</router-link>
          <router-link to="/calculator" class="hover:text-[#21CE99] font-medium transition">Kalkulator</router-link>
          <router-link to="/settings" class="hover:text-[#21CE99] font-medium transition">Pengaturan</router-link>
          <button @click="logout" class="bg-[#F45532] px-4 py-1.5 rounded-full hover:bg-red-600 transition font-bold text-white shadow-sm">Logout</button>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="md:hidden">
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="focus:outline-none text-white p-2">
            <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <div v-show="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-[#151B29] shadow-lg border-t border-[#2A3143] flex flex-col z-30">
        <router-link @click="isMobileMenuOpen = false" to="/" class="block px-6 py-4 hover:bg-[#1C2436] font-medium border-b border-[#2A3143]">Dashboard</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/transactions" class="block px-6 py-4 hover:bg-[#1C2436] font-medium border-b border-[#2A3143]">Transactions</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/budget" class="block px-6 py-4 hover:bg-[#1C2436] font-medium border-b border-[#2A3143]">Budget</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/calculator" class="block px-6 py-4 hover:bg-[#1C2436] font-medium border-b border-[#2A3143]">Kalkulator</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/settings" class="block px-6 py-4 hover:bg-[#1C2436] font-medium border-b border-[#2A3143]">Pengaturan</router-link>
        <button @click="() => { isMobileMenuOpen = false; logout(); }" class="block w-full text-left px-6 py-4 text-[#F45532] hover:bg-[#1C2436] font-bold transition cursor-pointer">Logout</button>
      </div>
    </nav>
    
    <!-- Main Content -->
    <div class="p-4 md:p-8 flex-grow max-w-7xl mx-auto w-full">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isMobileMenuOpen = ref(false)

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>