<script lang="ts">
  type InputProps = {
    value: string;
    label?: string;
    type?: 'text' | 'email' | 'password' | 'time';
    id?: string;
    placeholder?: string;
    error?: string;
    class?: string;
    disabled?: boolean;
  };
  
  let {
    value = $bindable(),
    label,
    type = 'text',
    id = Math.random().toString(36).substring(2, 9),
    placeholder = '',
    error = '',
    class: className = '',
    disabled = false
  }: InputProps = $props();
</script>

<div class="flex flex-col gap-1.5 {className}">
  {#if label}
    <label for={id} class="text-sm font-medium text-[var(--nc-text)]">
      {label}
    </label>
  {/if}
  
  <input
    {id}
    {type}
    {placeholder}
    bind:value
    {disabled}
    class="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--nc-primary)] transition-colors bg-[var(--nc-input)] text-[var(--nc-text)] w-full disabled:opacity-60
           {error ? 'border-red-500 focus:ring-red-500' : 'border-[var(--nc-border)]'}"
  />
  
  {#if error}
    <span class="text-xs text-red-500 font-medium">{error}</span>
  {/if}
</div>
