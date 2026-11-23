// Each viewer: tabs -> rows -> { ref, note, aspect, variants: [[label, src], ...] }.
// Tabs or rows are hidden when there is only one.

const R = 'static/videos/results/';
const mainRow = (task, method, labels) => ({
  ref: `${R}${task}_${method}_ref.mp4`,
  aspect: method === 'dmt' ? '576 / 320' : '1',
  variants: labels.map((l, i) => [l, `${R}${task}_${method}_${['default', 'a', 'b'][i]}.mp4`]),
});

const MAIN = {
  shift: {
    label: 'Shift',
    note: 'The object can be shifted in any direction with a controllable magnitude; shifts of about one third of the frame work best.',
    rows: {
      ours: { label: 'Ours (MotionClone)', ...mainRow('shift', 'ours', ['No reframing', 'Shift right', 'Shift up']) },
      dmt: { label: 'DMT', ...mainRow('shift', 'dmt', ['No reframing', 'Shift down', 'Shift right']) },
      ctrlx: { label: 'Ctrl-X', ...mainRow('shift', 'ctrlx', ['No reframing', 'Shift right', 'Shift left']) },
    },
  },
  zoom: {
    label: 'Zoom',
    note: 'Zoom-in and zoom-out with a controllable scale.',
    rows: {
      ours: { label: 'Ours (MotionClone)', ...mainRow('zoom', 'ours', ['No reframing', 'Zoom-in 2.0×', 'Zoom-out 0.5×']) },
      dmt: { label: 'DMT', ...mainRow('zoom', 'dmt', ['No reframing', 'Zoom-in 2.0×', 'Zoom-out 0.5×']) },
      ctrlx: { label: 'Ctrl-X', ...mainRow('zoom', 'ctrlx', ['No reframing', 'Zoom-in 2.0×', 'Zoom-out 0.5×']) },
    },
  },
  warp: {
    label: 'Perspective',
    note: 'Perspective change toward the left, right, up, or down, for reference videos with a static camera.',
    rows: {
      ours: { label: 'Ours (MotionClone)', ...mainRow('warp', 'ours', ['No reframing', 'Right', 'Right (larger)']) },
      dmt: { label: 'DMT', ...mainRow('warp', 'dmt', ['No reframing', 'Left', 'Left (larger)']) },
      ctrlx: { label: 'Ctrl-X', ...mainRow('warp', 'ctrlx', ['No reframing', 'Left', 'Left (larger)']) },
    },
  },
};

const M = 'static/videos/more/';
const moreRow = (cat, scene, label, prompt, name) => ({
  label,
  note: `Prompt: "${prompt}"`,
  ref: `${M}${cat}_${scene}_ref.mp4`,
  variants: [
    ['No reframing', `${M}${cat}_${scene}_default.mp4`],
    [name, `${M}${cat}_${scene}_a.mp4`],
    [`${name} (larger)`, `${M}${cat}_${scene}_b.mp4`],
  ],
});

const MORE = {
  rotate: {
    label: 'Rotation',
    rows: {
      boat: moreRow('rotate', 'boat', 'Boat → Raft', 'A birds-eye view of a wooden log raft sailing on the ocean', 'Rotate'),
      shark: moreRow('rotate', 'shark', 'Shark → Dolphin', 'A dolphin swimming underwater in the ocean', 'Rotate'),
      tiger: moreRow('rotate', 'tiger_zoo', 'Tiger → Cat', 'A cat walking along a grass hill', 'Rotate'),
    },
  },
  perspective: {
    label: 'Perspective',
    rows: {
      car: moreRow('perspective', 'green_car', 'Car → Porsche', 'A black porsche driving on a town road', 'Perspective'),
      train: moreRow('perspective', 'train', 'Train → Snowy train', 'A train passing a station covered in snow, bright morning', 'Perspective'),
      walk: moreRow('perspective', 'walk2', 'Walk → Iron Man', 'Iron Man walking in a spaceship', 'Perspective'),
    },
  },
  combined: {
    label: 'Combined',
    rows: {
      lucia: moreRow('combined', 'lucia', 'Walk → Darth Vader', 'Darth Vader walking uphill in the forest', 'Combined'),
      tiger: moreRow('combined', 'tiger_zoo', 'Tiger → Cat', 'A cat walking uphill along a grass hill', 'Combined'),
      fox: moreRow('combined', 'fox_run', 'Fox → Arctic fox', 'Arctic fox running in the snow', 'Combined'),
    },
  },
};

const C = 'static/videos/cameractrl/';
const camTab = (move, label) => ({
  label,
  rows: {
    lion: {
      note: 'Prompt: "Lion moves its head in the wild"',
      ref: `${C}lion_ref.mp4`,
      variants: [
        ['CameraCtrl only', `${C}lion_${move}_cameractrl.mp4`],
        ['Time-varying warp', `${C}lion_${move}_timevarying.mp4`],
        ['Ours (latent warp)', `${C}lion_${move}_ours.mp4`],
      ],
    },
  },
});

const CAM = {
  zoomin: camTab('zoomin', 'Zoom-in'),
  zoomout: camTab('zoomout', 'Zoom-out'),
  shift: camTab('shift', 'Pan'),
};

const sceneRow = (scene, label, prompt) => ({
  label,
  note: `Prompt: "${prompt}"`,
  ref: `${C}${scene}_ref.mp4`,
  variants: [['Zoom-in', `${C}${scene}_zoomin.mp4`], ['Zoom-out', `${C}${scene}_zoomout.mp4`]],
});

const SCENES = {
  all: {
    rows: {
      tiger: sceneRow('tiger', 'Tiger → Cat', 'Cat, walking, in the wild'),
      shark: sceneRow('shark', 'Shark → Dolphin', 'A dolphin swimming in the ocean'),
      wolf: sceneRow('wolf', 'Wolf → Lion', 'A lion turning its head in the forest'),
    },
  },
};

function viewer(id, data, defaultVariant) {
  const root = document.getElementById(id);
  const tabBox = root.querySelector('.v-tabs');
  const rowBox = root.querySelector('.v-rows');
  const varBox = root.querySelector('.v-variants');
  const ref = root.querySelector('.v-ref');
  const out = root.querySelector('.v-out');
  const note = root.querySelector('.v-note');
  let tab = Object.keys(data)[0];
  let row = Object.keys(data[tab].rows)[0];
  let variant = defaultVariant;

  function buttons(box, items, active, onPick, cls) {
    box.innerHTML = '';
    items.forEach(([key, label]) => {
      const b = document.createElement('button');
      b.className = `button is-rounded ${cls}` + (key === active ? ' is-dark' : '');
      b.textContent = label;
      b.onclick = () => onPick(key);
      box.appendChild(b);
    });
  }

  function render() {
    const tabs = Object.entries(data);
    tabBox.style.display = tabs.length > 1 ? '' : 'none';
    tabBox.innerHTML = '<ul>' + tabs.map(([k, t]) =>
      `<li class="${k === tab ? 'is-active' : ''}" data-k="${k}"><a>${t.label}</a></li>`).join('') + '</ul>';
    tabBox.querySelectorAll('li').forEach(li => li.onclick = () => {
      tab = li.dataset.k;
      if (!(row in data[tab].rows)) row = Object.keys(data[tab].rows)[0];
      variant = defaultVariant; render();
    });

    const rows = Object.entries(data[tab].rows);
    rowBox.style.display = rows.length > 1 ? '' : 'none';
    buttons(rowBox, rows.map(([k, r]) => [k, r.label]), row,
      k => { row = k; variant = defaultVariant; render(); }, 'is-small');

    const r = data[tab].rows[row];
    buttons(varBox, r.variants.map(([l], i) => [i, l]), variant, i => { variant = i; render(); }, '');
    [ref, out].forEach(v => v.style.setProperty('--ar', r.aspect || '1'));
    ref.src = r.ref;
    out.src = r.variants[variant][1];
    note.textContent = r.note || data[tab].note || '';
    [ref, out].forEach(v => { v.currentTime = 0; v.play().catch(() => {}); });
  }
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  viewer('main-viewer', MAIN, 1);
  viewer('more-viewer', MORE, 1);
  viewer('cam-viewer', CAM, 2);
  viewer('scene-viewer', SCENES, 0);
});
