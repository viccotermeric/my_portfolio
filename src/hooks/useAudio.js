export function useAudio() {
  function initAudio() {
    // Disabled sound effects as requested
  }

  function playSound(frequency, type, duration = 0.08, volume = 0.2) {
    // Disabled
  }

  function playTypingSound() {
    // Disabled
  }

  return { initAudio, playSound, playTypingSound };
}
