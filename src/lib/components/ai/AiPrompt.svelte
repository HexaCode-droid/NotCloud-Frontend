<script lang="ts">
  import { aiService } from '$lib/services/ai.service';

  let {
    context = '',
    oninsert,
    onclose,
  }: {
    context?: string;
    oninsert: (text: string) => void;
    onclose: () => void;
  } = $props();

  let prompt = $state('');
  let result = $state('');
  let isLoading = $state(false);
  let error = $state('');
  let inputEl: HTMLInputElement;
  let phase = $state<'input' | 'result'>('input');

  $effect(() => {
    // Auto-focus al montarse
    setTimeout(() => inputEl?.focus(), 50);
  });

  async function handleSubmit() {
    if (!prompt.trim() || isLoading) return;
    isLoading = true;
    error = '';
    result = '';
    try {
      result = await aiService.complete(prompt.trim(), context || undefined);
      phase = 'result';
    } catch (e: any) {
      error = 'Error al contactar con la IA. Inténtalo de nuevo.';
    } finally {
      isLoading = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onclose();
    }
    if (e.key === 'Enter' && !e.shiftKey && phase === 'input') {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInsert() {
    if (result) {
      oninsert(result);
      onclose();
    }
  }

  function handleRetry() {
    phase = 'input';
    result = '';
    error = '';
    setTimeout(() => inputEl?.focus(), 50);
  }
</script>

<!-- Overlay invisible para cerrar al hacer click fuera -->
<div
  class="fixed inset-0 z-40"
  onclick={onclose}
  onkeydown={() => {}}
  role="button"
  tabindex="-1"
  aria-label="Cerrar asistente IA"
></div>

<!-- Panel principal del asistente -->
<div
  class="absolute left-0 z-50 mt-1 w-full min-w-[380px] max-w-lg ai-panel"
  role="dialog"
  aria-label="Asistente IA NotCloud"
  onkeydown={handleKeyDown}
>
  <!-- Header -->
  <div class="ai-header">
    <div class="ai-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    </div>
    <span class="ai-title">Asistente IA</span>
    <button class="ai-close" onclick={onclose} aria-label="Cerrar">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>

  <!-- Cuerpo -->
  <div class="ai-body">
    {#if phase === 'input'}
      <!-- Input de la pregunta -->
      <div class="ai-input-wrap">
        <input
          bind:this={inputEl}
          bind:value={prompt}
          onkeydown={handleKeyDown}
          placeholder="Pregunta o pide que escriba algo..."
          class="ai-input"
          disabled={isLoading}
        />
        <button
          onclick={handleSubmit}
          disabled={!prompt.trim() || isLoading}
          class="ai-send-btn"
          aria-label="Enviar"
        >
          {#if isLoading}
            <div class="ai-spinner"></div>
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          {/if}
        </button>
      </div>

      {#if isLoading}
        <p class="ai-thinking">
          <svg class="ai-thinking-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
          </svg>
          Pensando...
        </p>
      {/if}

      {#if error}
        <p class="ai-error">{error}</p>
      {/if}

      <p class="ai-hint">Enter para enviar · Esc para cerrar</p>

    {:else}
      <!-- Resultado -->
      <div class="ai-result-box">
        <p class="ai-result-text">{result}</p>
      </div>

      <div class="ai-result-actions">
        <button class="ai-btn-secondary" onclick={handleRetry}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M1 4v6h6M23 20v-6h-6"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
          </svg>
          Nueva pregunta
        </button>
        <button class="ai-btn-primary" onclick={handleInsert}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
          Insertar en nota
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .ai-panel {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    animation: ai-pop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes ai-pop {
    from { opacity: 0; transform: translateY(-8px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .ai-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
    border-bottom: 1px solid #e9ecf5;
  }

  .ai-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 7px;
    color: white;
    flex-shrink: 0;
  }

  .ai-title {
    font-size: 13px;
    font-weight: 600;
    color: #4338ca;
    flex: 1;
  }

  .ai-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    color: #9ca3af;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ai-close:hover { background: #f3f4f6; color: #374151; }

  .ai-body {
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ai-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f9fafb;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    padding: 6px 8px 6px 12px;
    transition: border-color 0.15s;
  }
  .ai-input-wrap:focus-within { border-color: #6366f1; background: white; }

  .ai-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #111827;
    placeholder-color: #9ca3af;
  }
  .ai-input:disabled { opacity: 0.6; }

  .ai-send-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .ai-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .ai-send-btn:not(:disabled):hover { transform: scale(1.05); }

  .ai-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .ai-thinking {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #8b5cf6;
    margin: 0;
    animation: pulse 1.2s ease-in-out infinite;
  }

  .ai-thinking-icon {
    flex-shrink: 0;
    animation: spin 1.4s linear infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }

  .ai-hint {
    font-size: 11px;
    color: #9ca3af;
    margin: 0;
  }

  .ai-error {
    font-size: 12px;
    color: #ef4444;
    margin: 0;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    border-radius: 7px;
    padding: 6px 10px;
  }

  .ai-result-box {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    max-height: 240px;
    overflow-y: auto;
  }

  .ai-result-text {
    font-size: 13.5px;
    color: #374151;
    line-height: 1.65;
    margin: 0;
    white-space: pre-wrap;
  }

  .ai-result-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .ai-btn-secondary {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 12px;
    border: 1px solid #e5e7eb;
    background: white;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ai-btn-secondary:hover { background: #f9fafb; border-color: #d1d5db; }

  .ai-btn-primary {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 7px 14px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.15s;
  }
  .ai-btn-primary:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(99,102,241,0.35); }
</style>
