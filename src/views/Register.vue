<template>
 <div class="flex justify-center items-center min-h-screen bg-[#0A0E17] p-4 font-sans text-white">
  <div class="bg-[#151B29] border border-[#2A3143] p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm">
   <div class="text-center mb-8">
     <h2 class="text-3xl font-bold tracking-tight mb-2"><span class="text-[#21CE99]">MK</span> Mobile</h2>
     <p class="text-[#8F9BB3] text-sm">Daftar akun baru</p>
   </div>
   <form @submit.prevent="handleRegister">
    <div class="mb-5">
      <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Nama Lengkap</label>
      <input v-model="fullName" type="text" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99] focus:ring-1 focus:ring-[#21CE99] transition" placeholder="Budi Santoso">
    </div>
    <div class="mb-5">
      <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Email</label>
      <input v-model="email" type="email" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99] focus:ring-1 focus:ring-[#21CE99] transition" placeholder="budi@example.com">
    </div>
    <div class="mb-8">
      <label class="block text-sm font-medium text-[#8F9BB3] mb-1.5 ml-1">Password</label>
      <input v-model="password" type="password" required class="w-full bg-[#0A0E17] border border-[#2A3143] text-white p-3 rounded-xl focus:outline-none focus:border-[#21CE99] focus:ring-1 focus:ring-[#21CE99] transition" placeholder="••••••••">
    </div>
    <button type="submit" class="w-full bg-[#21CE99] text-[#0A0E17] font-bold p-3 rounded-xl hover:bg-[#1db989] transition shadow-md mb-4">
      Daftar Sekarang
    </button>
    <div class="text-center text-sm text-[#8F9BB3]">
      Sudah punya akun? 
      <router-link to="/login" class="text-[#21CE99] hover:underline font-medium">Login disini</router-link>
    </div>
   </form>
  </div>
 </div>
</template>
<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const fullName = ref('')
const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
 try {
  await authStore.register(email.value, fullName.value, password.value)
  // Auto login after successful registration (optional, or redirect to login)
  await authStore.login(email.value, password.value)
  router.push('/')
 } catch (error) {
  const errMsg = error.response?.data?.detail || 'Registration failed'
  alert(`Gagal mendaftar: ${errMsg}`)
 }
}
</script>