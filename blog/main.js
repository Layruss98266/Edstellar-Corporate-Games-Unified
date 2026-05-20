
  // Tab scrolling arrows
  document.querySelectorAll('.tabs-wrap').forEach(wrap => {
    const row  = wrap.querySelector('.tab-row');
    const prev = wrap.querySelector('.tab-prev');
    const next = wrap.querySelector('.tab-next');
    if (!row || !prev || !next) return;

    const step = () => Math.max(120, row.clientWidth * 0.7);
    const update = () => {
      prev.disabled = row.scrollLeft <= 2;
      next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 2;
    };

    prev.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => row.scrollBy({ left:  step(), behavior: 'smooth' }));
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Click-based animated guided demo
  document.querySelectorAll('.gdemo').forEach(demo => {
    const scenes = demo.querySelectorAll('.gscene');
    if (!scenes.length) return;

    const progressEl = demo.querySelector('.gdemo-progress');
    const counterEl  = demo.querySelector('.gdemo-counter');
    const titleEl    = demo.querySelector('.gtitle');
    const subEl      = demo.querySelector('.gsub');

    // Build progress indicator from scene count
    progressEl.innerHTML = '';
    scenes.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'gstep';
      dot.textContent = i + 1;
      progressEl.appendChild(dot);
      if (i < scenes.length - 1) {
        const line = document.createElement('div');
        line.className = 'gline';
        progressEl.appendChild(line);
      }
    });

    const total = scenes.length;
    let idx = 0;
    const render = () => {
      const dots  = progressEl.querySelectorAll('.gstep');
      const lines = progressEl.querySelectorAll('.gline');
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === idx);
        d.classList.toggle('done',   i <  idx);
      });
      lines.forEach((l, i) => l.classList.toggle('done', i < idx));

      // Restart animations by removing then re-adding active
      scenes.forEach((s, i) => {
        if (i === idx) {
          s.classList.remove('active');
          // Force reflow so animation restarts
          void s.offsetWidth;
          s.classList.add('active');
          titleEl.innerHTML = s.dataset.title || '';
          subEl.innerHTML   = s.dataset.sub || '';
        } else {
          s.classList.remove('active');
        }
      });

      counterEl.textContent = `Step ${idx + 1} of ${total}`;
      demo.classList.toggle('is-done', idx === total - 1);
    };

    demo.addEventListener('click', () => {
      if (!demo.classList.contains('is-started')) {
        demo.classList.add('is-started');
      }
      idx = (idx + 1) % total;
      render();
    });

    // Initialize captions from first scene
    titleEl.innerHTML = scenes[0].dataset.title || '';
    subEl.innerHTML   = scenes[0].dataset.sub || '';
    render();
  });

  // Mobile carousel for Tips + Real-World Applications cards
  document.querySelectorAll('.bottom-grid').forEach(grid => {
    const cards = grid.querySelectorAll(':scope > .mini-card');
    if (cards.length < 2) return;

    const dots = document.createElement('div');
    dots.className = 'bg-dots';
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to card ${i + 1}`);
      dots.appendChild(d);
    });
    grid.parentNode.insertBefore(dots, grid.nextSibling);

    const dotEls = dots.querySelectorAll('.dot');
    const getIdx = () => {
      const w = cards[0].getBoundingClientRect().width + 12; /* card + gap */
      return Math.round(grid.scrollLeft / w);
    };
    const sync = () => {
      const i = Math.max(0, Math.min(cards.length - 1, getIdx()));
      dotEls.forEach((d, n) => d.classList.toggle('active', n === i));
    };
    grid.addEventListener('scroll', sync, { passive: true });
    dotEls.forEach((d, i) => {
      d.addEventListener('click', () => {
        const w = cards[0].getBoundingClientRect().width + 12;
        grid.scrollTo({ left: i * w, behavior: 'smooth' });
      });
    });
  });

  // Tab content switching — scoped per activity card
  document.querySelectorAll('.activity-card').forEach(card => {
    const tabs = card.querySelectorAll('.tab-row .tab');
    const panels = card.querySelectorAll('.tab-panels > .tab-panel');
    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });


(function(){
  const modal = document.getElementById('gdemoFullscreenModal');
  const mount = document.getElementById('gdemoFullscreenMount');
  const modalTitle = document.getElementById('gdemoFullscreenTitle');
  const modalSub = document.getElementById('gdemoFullscreenSub');
  const closeBtn = document.getElementById('gdemoFullscreenClose');
  const browserFsBtn = document.getElementById('gdemoBrowserFullscreen');
  const prevBtn = document.getElementById('gdemoFsPrev');
  const nextBtn = document.getElementById('gdemoFsNext');

  if(!modal || !mount) return;

  let activeDemo = null;
  let activeScenes = [];
  let activeIdx = 0;

  function setupDemo(demo){
    const progressEl = demo.querySelector('.gdemo-progress');
    const counterEl  = demo.querySelector('.gdemo-counter');
    const titleEl    = demo.querySelector('.gtitle');
    const subEl      = demo.querySelector('.gsub');
    const scenes = Array.from(demo.querySelectorAll('.gscene'));

    if(!progressEl || !counterEl || !titleEl || !subEl || !scenes.length) return;

    progressEl.innerHTML = '';
    scenes.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'gstep';
      dot.textContent = i + 1;
      progressEl.appendChild(dot);
      if(i < scenes.length - 1){
        const line = document.createElement('div');
        line.className = 'gline';
        progressEl.appendChild(line);
      }
    });

    activeDemo = demo;
    activeScenes = scenes;
    activeIdx = 0;

    function render(){
      const dots = progressEl.querySelectorAll('.gstep');
      const lines = progressEl.querySelectorAll('.gline');

      dots.forEach((d, i) => {
        d.classList.toggle('active', i === activeIdx);
        d.classList.toggle('done', i < activeIdx);
      });

      lines.forEach((l, i) => l.classList.toggle('done', i < activeIdx));

      scenes.forEach((s, i) => {
        if(i === activeIdx){
          s.classList.remove('active');
          void s.offsetWidth;
          s.classList.add('active');
          titleEl.innerHTML = s.dataset.title || '';
          subEl.innerHTML = s.dataset.sub || '';
        }else{
          s.classList.remove('active');
        }
      });

      counterEl.textContent = `Step ${activeIdx + 1} of ${scenes.length}`;
      demo.classList.toggle('is-done', activeIdx === scenes.length - 1);
      demo.classList.add('is-started');
    }

    demo.__fsRender = render;
    demo.__fsNext = function(){
      activeIdx = activeIdx === scenes.length - 1 ? 0 : activeIdx + 1;
      render();
    };
    demo.__fsPrev = function(){
      activeIdx = Math.max(0, activeIdx - 1);
      render();
    };

    demo.addEventListener('click', function(e){
      if(e.target.closest('.gdemo-fullscreen-btn')) return;
      demo.__fsNext();
    });

    render();
  }

  function openFullscreen(originalDemo){
    mount.innerHTML = '';
    const clone = originalDemo.cloneNode(true);

    clone.classList.remove('is-done');
    clone.classList.add('is-started');

    clone.querySelectorAll('.gdemo-fullscreen-btn').forEach(btn => btn.remove());

    const card = originalDemo.closest('.activity-card');
    const title = card?.querySelector('.ac-title')?.textContent?.trim() || originalDemo.dataset.game || 'Activity Demo';
    const desc = card?.querySelector('.ac-desc')?.textContent?.trim() || 'Large guided activity view.';

    modalTitle.textContent = title;
    modalSub.textContent = desc;
    mount.appendChild(clone);

    modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    setupDemo(clone);
  }

  function closeFullscreen(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    mount.innerHTML = '';
    activeDemo = null;
    activeScenes = [];
    activeIdx = 0;
  }

  function addButtons(){
    document.querySelectorAll('.gdemo').forEach((demo) => {
      if(demo.querySelector('.gdemo-fullscreen-btn')) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'gdemo-fullscreen-btn';
      btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg> Fullscreen';
      btn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        openFullscreen(demo);
      });

      demo.appendChild(btn);
    });
  }

  closeBtn?.addEventListener('click', closeFullscreen);

  modal.addEventListener('click', function(e){
    if(e.target === modal) closeFullscreen();
  });

  document.addEventListener('keydown', function(e){
    if(!modal.classList.contains('show')) return;

    if(e.key === 'Escape') closeFullscreen();
    if(e.key === 'ArrowRight') activeDemo?.__fsNext?.();
    if(e.key === 'ArrowLeft') activeDemo?.__fsPrev?.();
  });

  nextBtn?.addEventListener('click', function(){
    activeDemo?.__fsNext?.();
  });

  prevBtn?.addEventListener('click', function(){
    activeDemo?.__fsPrev?.();
  });

  browserFsBtn?.addEventListener('click', async function(){
    const shell = modal.querySelector('.gdemo-fullscreen-shell');
    try{
      if(!document.fullscreenElement && shell?.requestFullscreen){
        await shell.requestFullscreen();
      }else if(document.exitFullscreen){
        await document.exitFullscreen();
      }
    }catch(err){
      alert('Browser fullscreen was blocked. You can still use the large popup view.');
    }
  });

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', addButtons);
  }else{
    addButtons();
  }
})();

