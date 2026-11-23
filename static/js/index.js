const RESULTS = {
  shift: {
    note: 'Direction and magnitude are free; clear directions with about one third of the frame work best.',
    variants: {
      ours: [['No reframing', 'default'], ['Shift right', 'a'], ['Shift up', 'b']],
      dmt: [['No reframing', 'default'], ['Shift down', 'a'], ['Shift right', 'b']],
      ctrlx: [['No reframing', 'default'], ['Shift right', 'a'], ['Shift left', 'b']],
    },
  },
  zoom: {
    note: 'Zoom-in and zoom-out with a controllable magnitude.',
    variants: {
      ours: [['No reframing', 'default'], ['Zoom-in 2.0×', 'a'], ['Zoom-out 0.5×', 'b']],
      dmt: [['No reframing', 'default'], ['Zoom-in 2.0×', 'a'], ['Zoom-out 0.5×', 'b']],
      ctrlx: [['No reframing', 'default'], ['Zoom-in 2.0×', 'a'], ['Zoom-out 0.5×', 'b']],
    },
  },
  warp: {
    note: 'With a static camera, the viewpoint can be shifted in the four cardinal directions.',
    variants: {
      ours: [['No reframing', 'default'], ['Right', 'a'], ['Right (larger)', 'b']],
      dmt: [['No reframing', 'default'], ['Left', 'a'], ['Left (larger)', 'b']],
      ctrlx: [['No reframing', 'default'], ['Left', 'a'], ['Left (larger)', 'b']],
    },
  },
};
const ASPECT = { dmt: '576 / 320' };

document.addEventListener('DOMContentLoaded', () => {
  const ref = document.getElementById('ref-video');
  const out = document.getElementById('out-video');
  const variantBox = document.getElementById('variant-buttons');
  const note = document.getElementById('task-note');
  let task = 'shift', method = 'ours', variant = 'a';

  const src = v => `static/videos/results/${task}_${method}_${v}.mp4`;

  function restart() {
    [ref, out].forEach(v => { v.currentTime = 0; v.play().catch(() => {}); });
  }

  function render() {
    const ar = ASPECT[method] || '1';
    [ref, out].forEach(v => v.style.setProperty('--ar', ar));
    ref.src = src('ref');
    out.src = src(variant);
    note.textContent = RESULTS[task].note;
    variantBox.innerHTML = '';
    RESULTS[task].variants[method].forEach(([label, key]) => {
      const b = document.createElement('button');
      b.className = 'button is-rounded' + (key === variant ? ' is-dark' : '');
      b.textContent = label;
      b.onclick = () => { variant = key; render(); };
      variantBox.appendChild(b);
    });
    restart();
  }

  document.querySelectorAll('#task-tabs li').forEach(li => li.addEventListener('click', () => {
    document.querySelectorAll('#task-tabs li').forEach(x => x.classList.toggle('is-active', x === li));
    task = li.dataset.task; variant = 'a'; render();
  }));
  document.querySelectorAll('#method-buttons .button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('#method-buttons .button').forEach(x => x.classList.toggle('is-dark', x === btn));
    method = btn.dataset.method; variant = 'a'; render();
  }));
  render();
});

document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('scene-video');
  document.querySelectorAll('#scene-buttons .button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('#scene-buttons .button').forEach(x => x.classList.toggle('is-dark', x === btn));
    video.src = `static/videos/cameractrl/${btn.dataset.scene}.mp4`;
    video.play().catch(() => {});
  }));
});
