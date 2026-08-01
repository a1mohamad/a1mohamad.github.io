/* ==========================================================================
   TOEFL Vocab — app landing page
   Two behaviours: a platform switch that retargets every screenshot, tint and
   download link, and a live four-word demo of the app's actual study loop.
   ========================================================================== */

const REPO = {
  ios:     'https://github.com/a1mohamad/toefl-vocabs-ios-app',
  android: 'https://github.com/a1mohamad/toefl-vocabs-android-app'
};
const RESEARCH = 'https://a1mohamad.github.io/research/toefl-vocabs-ios/index.html';

const SHOTS = ['library', 'practice', 'practice-revealed', 'reports'];
const FILE = {
  library: 'library-dark.png',
  practice: 'practice-dark.png',
  'practice-revealed': 'practice-revealed-dark.png',
  reports: 'reports-dark.png'
};

const $ = s => document.querySelector(s);
const screenEl = $('#screen');
const cap = $('#cap');
const beats = [...document.querySelectorAll('.beat')];

let platform = 'ios';
let current = 0;

/* ---------- screenshots ---------- */

function paint() {
  screenEl.innerHTML = '';
  SHOTS.forEach((s, i) => {
    const img = new Image();
    img.src = `assets/${platform}/${FILE[s]}`;
    img.alt = '';
    if (i === 0) img.classList.add('on');
    screenEl.appendChild(img);
  });
  beats.forEach(b => {
    b.querySelector('.beatshot img').src = `assets/${platform}/${FILE[b.dataset.shot]}`;
  });
  show(current);
}

function show(i) {
  current = i;
  [...screenEl.children].forEach((el, n) => el.classList.toggle('on', n === i));
  if (beats[i]) cap.textContent = beats[i].dataset.cap;
}

/* ---------- platform switch ---------- */

const thumb = $('#thumb');
const tabs = [...document.querySelectorAll('.seg button')];

function moveThumb() {
  const b = tabs.find(t => t.getAttribute('aria-selected') === 'true');
  thumb.style.left = b.offsetLeft + 'px';
  thumb.style.width = b.offsetWidth + 'px';
}

tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.setAttribute('aria-selected', x === t ? 'true' : 'false'));
  platform = t.dataset.p;
  document.documentElement.dataset.p = platform;
  moveThumb();
  paint();
  buildCTA();
}));

/* ---------- scroll-driven beats (desktop only) ----------
   Below 900px the sticky device is gone, so there is nothing to drive and
   every beat is shown at full opacity instead. */

const mq = matchMedia('(min-width:901px)');
let io = null;

function wireStage() {
  if (io) { io.disconnect(); io = null; }
  if (!mq.matches) { beats.forEach(b => b.classList.add('on')); return; }
  io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      beats.forEach(b => b.classList.toggle('on', b === e.target));
      show(beats.indexOf(e.target));
    }
  }), { rootMargin: '-45% 0px -45% 0px' });
  beats.forEach(b => io.observe(b));
}

mq.addEventListener('change', () => { wireStage(); moveThumb(); });

/* ---------- live demo ----------
   Real entries from the app's bundled vocabs.json, including the usage tips
   that the loader splits out of the definitions that carry them. */

const WORDS = [
  { t: 'abandon',   d: 'desert; leave without planning to come back; quit' },
  { t: 'keen',      d: 'sharp; eager; intense; sensitive' },
  { t: 'aggregate', d: 'gathered into or amounting to a whole',
                    tip: 'Usually followed by a word like sum, total or numbers.' },
  { t: 'adversely', d: 'in a harmful way; negatively',
                    tip: 'Almost always followed by affect.' }
];

let wi = 0;
let answers = [];
const boxes = [...document.querySelectorAll('#boxes i')];

function renderWord() {
  const w = WORDS[wi];
  $('#term').textContent = w.t;
  $('#def').textContent = w.d;
  $('#counter').textContent = `Word ${wi + 1} of ${WORDS.length}`;
  $('#tipbox').hidden = true;
  $('#reveal').classList.remove('on');
  $('#answers').style.display = 'grid';
  $('#next').classList.remove('on');
}

function answer(knew) {
  const w = WORDS[wi];
  answers.push(knew);
  boxes[answers.length - 1].className = knew ? 'y' : 'n';
  $('#reveal').classList.add('on');
  if (w.tip) { $('#tip').textContent = w.tip; $('#tipbox').hidden = false; }
  $('#answers').style.display = 'none';
  $('#next').classList.add('on');
  $('#next').textContent = wi === WORDS.length - 1 ? 'See how you did →' : 'Next word →';
}

$('.knew').onclick = () => answer(true);
$('.didnt').onclick = () => answer(false);
$('#next').onclick = () => {
  if (wi === WORDS.length - 1) { finish(); return; }
  wi++; renderWord();
};

function finish() {
  $('#play').style.display = 'none';
  $('#done').classList.add('on');
  const right = answers.filter(Boolean).length;
  const pct = Math.round(right / answers.length * 100);
  $('#pct').textContent = pct + '%';
  setTimeout(() => { $('#arc').style.strokeDashoffset = 314 - (314 * pct / 100); }, 80);
  const missed = WORDS.filter((w, n) => !answers[n]).map(w => w.t);
  $('#donetext').textContent = missed.length
    ? `In the app it keeps going — and ${missed.join(' and ')} would be waiting at the front of your next session.`
    : `In the app it keeps going, and words you ace step aside to make room for the ones you don't.`;
}

$('#again').onclick = () => {
  wi = 0; answers = [];
  boxes.forEach(b => b.className = '');
  $('#done').classList.remove('on');
  $('#play').style.display = 'block';
  renderWord();
};

$('#speak').onclick = e => {
  const b = e.currentTarget;
  b.classList.add('play');
  setTimeout(() => b.classList.remove('play'), 600);
  if (window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(WORDS[wi].t);
    u.lang = 'en-US';
    speechSynthesis.speak(u);
  }
};

/* ---------- action buttons ---------- */

function buildCTA() {
  const ios = platform === 'ios';
  $('#cta').innerHTML = `
    <a class="btn primary" href="${REPO[platform]}/releases/latest" target="_blank" rel="noopener">
      <i class="fa-brands fa-${ios ? 'apple' : 'android'}"></i> Download for ${ios ? 'iPhone' : 'Android'}</a>
    <a class="btn" href="${REPO[platform]}" target="_blank" rel="noopener">
      <i class="fa-brands fa-github"></i> ${ios ? 'iOS' : 'Android'} source code</a>
    <a class="btn" href="${RESEARCH}" target="_blank" rel="noopener">
      <i class="fa-solid fa-flask"></i> How it was built</a>`;
}

addEventListener('resize', moveThumb);
moveThumb(); paint(); buildCTA(); renderWord(); wireStage();
