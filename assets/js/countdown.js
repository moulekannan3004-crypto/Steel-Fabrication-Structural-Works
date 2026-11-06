/**
 * SteelCraft - Countdown Timer Engine
 * Powers the Coming Soon / Maintenance page with live Days, Hours, Minutes, Seconds
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const countdownDays = document.getElementById('countDays');
  const countdownHours = document.getElementById('countHours');
  const countdownMinutes = document.getElementById('countMinutes');
  const countdownSeconds = document.getElementById('countSeconds');

  if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
    // Target date: 45 days from current date
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 45);

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        countdownDays.textContent = '00';
        countdownHours.textContent = '00';
        countdownMinutes.textContent = '00';
        countdownSeconds.textContent = '00';
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      countdownDays.textContent = String(days).padStart(2, '0');
      countdownHours.textContent = String(hours).padStart(2, '0');
      countdownMinutes.textContent = String(minutes).padStart(2, '0');
      countdownSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});
