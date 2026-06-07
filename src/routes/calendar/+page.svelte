<script lang="ts">
  import { onMount } from 'svelte';
  import { addMonths, endOfMonth, format, isSameDay, setHours, setMinutes, startOfMonth } from 'date-fns';
  import { es } from 'date-fns/locale';
  import CalendarView from '$lib/components/calendar/CalendarView.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { reminderService } from '$lib/services/reminder.service';
  import type { Reminder } from '$lib/types/settings.type';

  let currentMonth = $state(startOfMonth(new Date()));
  let selectedDate = $state(new Date());
  let reminders = $state<Reminder[]>([]);
  let isLoading = $state(true);
  let showForm = $state(false);
  let title = $state('');
  let description = $state('');
  let time = $state('09:00');
  let isSaving = $state(false);
  let message = $state('');
  let errorMessage = $state('');

  let selectedReminders = $derived(
    reminders.filter((r) => isSameDay(new Date(r.remindAt), selectedDate))
  );

  onMount(() => {
    loadReminders();
  });

  async function loadReminders() {
    isLoading = true;
    try {
      const from = startOfMonth(currentMonth).toISOString();
      const to = endOfMonth(currentMonth).toISOString();
      reminders = await reminderService.findAll(from, to);
    } catch (error) {
      console.error(error);
    } finally {
      isLoading = false;
    }
  }

  function handlePrevMonth() {
    currentMonth = addMonths(currentMonth, -1);
    loadReminders();
  }

  function handleNextMonth() {
    currentMonth = addMonths(currentMonth, 1);
    loadReminders();
  }

  function handleSelectDate(date: Date) {
    selectedDate = date;
    showForm = false;
  }

  async function handleCreateReminder() {
    if (!title.trim()) {
      errorMessage = 'El título es obligatorio';
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const remindAt = setMinutes(setHours(selectedDate, hours), minutes);

    if (remindAt <= new Date()) {
      errorMessage = 'El recordatorio debe ser en el futuro';
      return;
    }

    isSaving = true;
    errorMessage = '';
    message = '';

    try {
      const created = await reminderService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        remindAt: remindAt.toISOString()
      });
      reminders = [...reminders, created];
      title = '';
      description = '';
      showForm = false;
      message = 'Recordatorio creado';
    } catch (error: any) {
      errorMessage = error.response?.data?.message || 'No se pudo crear el recordatorio';
    } finally {
      isSaving = false;
    }
  }

  async function handleDeleteReminder(id: string) {
    if (!confirm('¿Eliminar este recordatorio?')) return;
    try {
      await reminderService.remove(id);
      reminders = reminders.filter((r) => r.id !== id);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="max-w-5xl mx-auto px-12 py-16 font-sans">
  <div class="text-sm text-[var(--nc-muted)] mb-8">
    <a href="/" class="hover:text-[var(--nc-text)]">NotCloud</a>
    <span class="mx-1">/</span>
    <span>Calendario</span>
  </div>

  <div class="mb-8 border-b border-[var(--nc-border)] pb-8">
    <div class="flex items-center gap-4">
      <div class="w-14 h-14 rounded-xl bg-[var(--nc-surface)] border border-[var(--nc-border)] flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--nc-muted)]">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div>
        <h1 class="text-4xl font-bold text-[var(--nc-text)]" style="font-family: ui-serif, Georgia, serif;">Calendario</h1>
        <p class="text-[var(--nc-muted)] mt-1">Programa recordatorios y recibe notificaciones</p>
      </div>
    </div>
  </div>

  {#if isLoading}
    <div class="flex justify-center py-16">
      <div class="w-6 h-6 border-2 border-[var(--nc-border)] border-t-[var(--nc-primary)] rounded-full animate-spin"></div>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2">
        <CalendarView
          {currentMonth}
          {selectedDate}
          {reminders}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      </div>

      <div class="space-y-4">
        <div class="p-4 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)]">
          <h2 class="font-semibold text-[var(--nc-text)] mb-1 capitalize">
            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </h2>
          <p class="text-sm text-[var(--nc-muted)] mb-4">
            {selectedReminders.length} recordatorio{selectedReminders.length === 1 ? '' : 's'}
          </p>

          {#if message}
            <p class="text-sm text-[var(--nc-primary)] mb-3">{message}</p>
          {/if}
          {#if errorMessage}
            <p class="text-sm text-red-600 mb-3">{errorMessage}</p>
          {/if}

          {#if !showForm}
            <Button onclick={() => (showForm = true)} class="w-full">+ Nuevo recordatorio</Button>
          {:else}
            <div class="space-y-3">
              <Input id="title" label="Título" type="text" placeholder="Ej: Entregar proyecto" bind:value={title} />
              <Input id="description" label="Descripción" type="text" placeholder="Opcional" bind:value={description} />
              <Input id="time" label="Hora" type="time" bind:value={time} />
              <div class="flex gap-2">
                <Button onclick={handleCreateReminder} isLoading={isSaving} class="flex-1">Guardar</Button>
                <Button onclick={() => (showForm = false)} class="flex-1">Cancelar</Button>
              </div>
            </div>
          {/if}
        </div>

        <div class="space-y-2">
          {#each selectedReminders as reminder}
            <div class="p-3 rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface)]">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-medium text-[var(--nc-text)]">{reminder.title}</p>
                  {#if reminder.description}
                    <p class="text-sm text-[var(--nc-muted)] mt-1">{reminder.description}</p>
                  {/if}
                  <p class="text-xs text-[var(--nc-muted)] mt-2">
                    {format(new Date(reminder.remindAt), 'HH:mm')}
                  </p>
                </div>
                <button
                  onclick={() => handleDeleteReminder(reminder.id)}
                  class="text-[var(--nc-muted)] hover:text-red-500 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          {:else}
            <p class="text-sm text-[var(--nc-muted)] text-center py-4">Sin recordatorios este día</p>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
