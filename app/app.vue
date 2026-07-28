<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body, html {
  font-family: 'Inter', sans-serif !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', sans-serif !important;
}

.premium-shadow {
  box-shadow: 0 10px 30px -10px rgba(0, 48, 87, 0.08), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
  border-color: rgba(226, 232, 240, 0.8) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.premium-shadow:hover {
  box-shadow: 0 20px 40px -15px rgba(0, 48, 87, 0.15), 0 0 0 1px rgba(30, 174, 76, 0.25) !important;
  transform: translateY(-3px);
}
</style>