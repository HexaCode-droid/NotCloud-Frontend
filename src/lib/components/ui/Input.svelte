<script lang="ts">
  type InputProps = {
    value: string;
    label?: string;
    type?: 'text' | 'email' | 'password';
    id?: string;
    placeholder?: string;
    error?: string;
    class?: string;
  };
  
  let {
    value = $bindable(),
    label,
    type = 'text',
    id = Math.random().toString(36).substring(2, 9),
    placeholder = '',
    error = '',
    class: className = ''
  }: InputProps = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
  {#if label}
    <label for={id} class="text-sm font-medium text-gray-700">
      {label}
    </label>
  {/if}
  
  <input
    {id}
    {type}
    {placeholder}
    bind:value
    class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white w-full
           {error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}"
  />
  
  {#if error}
    <span class="text-xs text-red-500 font-medium">{error}</span>
  {/if}
</div>
