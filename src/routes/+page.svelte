<script lang="ts">
  const recentPages = [
    { title: "Bienvenido a NotCloud", icon: "👋" },
    { title: "Ideas de Proyecto", icon: "💡" },
    { title: "Notas de Reunión", icon: "📝" },
    { title: "Lista de Lecturas", icon: "📚" }
  ];
</script>

<div class="max-w-4xl mx-auto px-12 py-16 font-sans">
  <!-- Breadcrumbs -->
  <div class="text-sm text-gray-500 mb-8">
    <span class="hover:underline cursor-pointer">NotCloud</span> 
    <span class="mx-1">/</span> 
    <span class="font-medium text-gray-900">Inicio</span>
  </div>

  <!-- Title Section -->
  <div class="mb-10 border-b border-gray-200 pb-8">
    <div class="text-5xl mb-4">🏠</div>
    <!-- Serif font for Notion-like header -->
    <h1 class="text-5xl font-bold text-[#37352f] tracking-tight" style="font-family: ui-serif, Georgia, serif;">Inicio</h1>
  </div>

  <!-- Add Button -->
  <button class="mb-12 inline-flex items-center gap-2 px-4 py-2 border border-gray-200 shadow-sm rounded-full bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
    Nueva página
  </button>

  <!-- Recent Pages -->
  <div>
    <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Páginas Recientes</h2>
    
    <div class="space-y-1">
      {#each recentPages as page}
        <button class="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-gray-100 transition-colors text-left group">
          <span class="text-xl">{page.icon}</span>
          <span class="font-medium text-gray-700 border-b border-transparent group-hover:border-gray-300 transition-colors">{page.title}</span>
        </button>
      {/each}
    </div>
  </div>
</div>
