<script setup lang="ts">
import { ShieldCheck, Lock } from 'lucide-vue-next'

defineProps<{
  variant?: 'footer' | 'checkout' | 'banner'
}>()
</script>

<template>
  <div class="inline-flex flex-wrap items-center gap-2.5">
    
    <!-- TROY LOGO -->
    <div class="h-8 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center transition hover:border-slate-300" title="Troy Yerli Kart Şeması">
      <svg viewBox="0 0 100 35" class="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="35" rx="4" fill="#FFFFFF"/>
        <text x="8" y="24" font-family="'Arial Black', Impact, sans-serif" font-size="20" font-weight="900" fill="#005B94" letter-spacing="-0.5">TROY</text>
        <path d="M72 10 L84 10 L81 25 L69 25 Z" fill="#E30613"/>
        <path d="M85 10 L94 10 L91 25 L82 25 Z" fill="#005B94"/>
      </svg>
    </div>

    <!-- VISA LOGO -->
    <div class="h-8 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center transition hover:border-slate-300" title="Visa Güvenli Kart Sistemi">
      <svg viewBox="0 0 100 35" class="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="35" rx="4" fill="#FFFFFF"/>
        <text x="12" y="25" font-family="'Arial Black', sans-serif" font-size="22" font-weight="900" font-style="italic" fill="#1A1F71" letter-spacing="-1">VISA</text>
      </svg>
    </div>

    <!-- MASTERCARD LOGO -->
    <div class="h-8 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center transition hover:border-slate-300" title="MasterCard 3D Secure">
      <svg viewBox="0 0 100 35" class="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="35" rx="4" fill="#FFFFFF"/>
        <circle cx="42" cy="17.5" r="11" fill="#EB001B"/>
        <circle cx="58" cy="17.5" r="11" fill="#F79E1B" fill-opacity="0.9"/>
        <path d="M50 8.5 C47.2 10.8 45.5 14 45.5 17.5 C45.5 21 47.2 24.2 50 26.5 C52.8 24.2 54.5 21 54.5 17.5 C54.5 14 52.8 10.8 50 8.5 Z" fill="#FF5F00"/>
      </svg>
    </div>

    <!-- AMERICAN EXPRESS LOGO -->
    <div class="h-8 px-2.5 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center justify-center transition hover:border-slate-300" title="American Express">
      <svg viewBox="0 0 100 35" class="h-5 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="35" rx="4" fill="#0077A6"/>
        <text x="14" y="23" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5">AMEX</text>
      </svg>
    </div>

    <!-- PAYNKOLAY 3D SECURE LOGOSU (AKTİF BANK) -->
    <div class="h-8 px-3 rounded-lg bg-[#0F223D] border border-orange-500/40 shadow-xs flex items-center gap-1.5 transition hover:border-orange-500/70" title="Paynkolay (Aktif Bank) 3D Secure Güvenli Ödeme">
      <div class="flex items-center tracking-tight font-sans">
        <span class="font-black text-xs text-white">pay</span>
        <span class="font-black text-sm text-[#FF5A00] leading-none px-0.5 font-mono">n</span>
        <span class="font-black text-xs text-white">kolay</span>
        <span class="text-[9px] font-black text-[#FF7A1A] bg-orange-500/20 border border-orange-500/40 px-1 py-0.2 rounded ml-1.5 uppercase">3D</span>
      </div>
      <span class="h-1.5 w-1.5 rounded-full bg-[#FF5A00]"></span>
    </div>

    <!-- 256-BIT SSL & TCMB SEAL -->
    <div class="h-8 px-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 shadow-xs flex items-center gap-1.5 text-[10px] font-black text-emerald-300" title="256-Bit SSL Sertifikalı Güvenli Ödeme">
      <Lock :size="12" class="text-emerald-400" />
      <span>256-BIT SSL</span>
    </div>

  </div>
</template>
