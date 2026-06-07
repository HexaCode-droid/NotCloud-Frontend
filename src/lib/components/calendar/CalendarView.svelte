<script lang="ts">
  import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek
  } from 'date-fns';
  import { es } from 'date-fns/locale';
  import type { Reminder } from '$lib/types/settings.type';

  interface Props {
    currentMonth: Date;
    selectedDate: Date;
    reminders: Reminder[];
    onSelectDate: (date: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
  }

  let {
    currentMonth,
    selectedDate,
    reminders,
    onSelectDate,
    onPrevMonth,
    onNextMonth
  }: Props = $props();

  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  let calendarDays = $derived(
    eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
    })
  );

  function remindersForDay(day: Date) {
    return reminders.filter((r) => isSameDay(new Date(r.remindAt), day));
  }
</script>

<div class="rounded-2xl border border-[var(--nc-border)] bg-[var(--nc-surface)] overflow-hidden">
  <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--nc-border)]">
    <button onclick={onPrevMonth} class="p-2 rounded-lg hover:bg-[var(--nc-hover)] text-[var(--nc-muted)]">←</button>
    <h3 class="text-lg font-semibold text-[var(--nc-text)] capitalize">
      {format(currentMonth, 'MMMM yyyy', { locale: es })}
    </h3>
    <button onclick={onNextMonth} class="p-2 rounded-lg hover:bg-[var(--nc-hover)] text-[var(--nc-muted)]">→</button>
  </div>

  <div class="grid grid-cols-7 border-b border-[var(--nc-border)]">
    {#each weekDays as day}
      <div class="py-2 text-center text-xs font-semibold text-[var(--nc-muted)] uppercase">{day}</div>
    {/each}
  </div>

  <div class="grid grid-cols-7">
    {#each calendarDays as day}
      {@const dayReminders = remindersForDay(day)}
      <button
        onclick={() => onSelectDate(day)}
        class="min-h-[80px] p-2 border-b border-r border-[var(--nc-border)] text-left transition-colors
          {!isSameMonth(day, currentMonth) ? 'opacity-40' : ''}
          {isSameDay(day, selectedDate) ? 'bg-[var(--nc-primary-soft)]' : 'hover:bg-[var(--nc-hover)]'}"
      >
        <span
          class="inline-flex w-7 h-7 items-center justify-center rounded-full text-sm font-medium
            {isToday(day) ? 'bg-[var(--nc-primary)] text-white' : 'text-[var(--nc-text)]'}"
        >
          {format(day, 'd')}
        </span>
        {#if dayReminders.length > 0}
          <div class="mt-1 space-y-0.5">
            {#each dayReminders.slice(0, 2) as reminder}
              <p class="text-[10px] truncate text-[var(--nc-primary)] font-medium">• {reminder.title}</p>
            {/each}
            {#if dayReminders.length > 2}
              <p class="text-[10px] text-[var(--nc-muted)]">+{dayReminders.length - 2} más</p>
            {/if}
          </div>
        {/if}
      </button>
    {/each}
  </div>
</div>
