<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { reminderService } from '$lib/services/reminder.service';
  import { userProfile } from '$lib/stores/settingsStore';

  let intervalId: ReturnType<typeof setInterval> | undefined;

  async function checkReminders() {
    const profile = $userProfile;
    if (!profile?.settings?.browserNotifications || !profile?.settings?.reminderNotifications) {
      return;
    }

    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return;
    }

    try {
      const upcoming = await reminderService.findUpcoming();
      const now = Date.now();

      for (const reminder of upcoming) {
        const remindTime = new Date(reminder.remindAt).getTime();
        if (remindTime <= now) {
          new Notification(`Recordatorio: ${reminder.title}`, {
            body: reminder.description ?? 'Tienes un recordatorio en NotCloud',
            icon: '/favicon.png'
          });
          await reminderService.markBrowserNotified(reminder.id);
        }
      }
    } catch (error) {
      console.error('Error comprobando recordatorios', error);
    }
  }

  onMount(() => {
    intervalId = setInterval(checkReminders, 30_000);
    checkReminders();
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });
</script>
