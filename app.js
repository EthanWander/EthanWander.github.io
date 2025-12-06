'use strict';

const NICE_EMOJIS = ['🎉', '🎊', '🪩', '🕺🏿', '✨', '🎁', '⭐', '🌟', '💫', '🔥', '😎'];
const FACE_CROPS = ['crops/crop1.JPG', 'crops/crop2.JPG'];

function basicMarkdownToHtml(md) {
  const lines = md.split(/\r?\n/);
  const html = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      html.push('');
      return;
    }

    if (trimmed.startsWith('### ')) {
      html.push(`<h3>${trimmed.slice(4)}</h3>`);
      return;
    }

    if (trimmed.startsWith('## ')) {
      html.push(`<h2>${trimmed.slice(3)}</h2>`);
      return;
    }

    if (trimmed.startsWith('# ')) {
      html.push(`<h2>${trimmed.slice(2)}</h2>`);
      return;
    }

    const strongReplaced = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html.push(`<p>${strongReplaced}</p>`);
  });

  return html.join('\n');
}

async function loadReadme() {
  const container = document.getElementById('readme-content');
  if (!container) return;

  try {
    const res = await fetch('README.md', { cache: 'no-cache' });
    if (!res.ok) {
      throw new Error(`Could not load README (status ${res.status})`);
    }
    const text = await res.text();
    container.innerHTML = basicMarkdownToHtml(text);
  } catch (err) {
    container.innerHTML = `<p class="loading">Onkelos Shindigs.</p>`;
    console.error(err);
  }
}

function createEmojiRain() {
  const rainContainer = document.getElementById('emoji-rain');
  if (!rainContainer) return;

  function dropEmoji() {
    const rainContainer = document.getElementById('emoji-rain');
    
    // 60% chance for emoji, 40% chance for face crop
    const useFace = Math.random() < 0.4;
    
    let particle;
    if (useFace) {
      particle = document.createElement('img');
      particle.className = 'img-particle';
      particle.src = FACE_CROPS[Math.floor(Math.random() * FACE_CROPS.length)];
    } else {
      particle = document.createElement('div');
      particle.className = 'emoji-particle';
      particle.textContent = NICE_EMOJIS[Math.floor(Math.random() * NICE_EMOJIS.length)];
    }

    const left = Math.random() * 100;
    const duration = 4 + Math.random() * 2;
    const delay = Math.random() * 0.5;

    particle.style.left = left + '%';
    particle.style.top = '-40px';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    rainContainer.appendChild(particle);

    setTimeout(() => particle.remove(), (duration + delay) * 1000);
  }

  setInterval(dropEmoji, 800);
}

window.addEventListener('DOMContentLoaded', () => {
  loadReadme();
  createEmojiRain();
});
