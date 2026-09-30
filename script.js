(function fx(){
  const canvas = document.getElementById('fx');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const sparkles = [];
  const colors = ['#8b1a2b', '#c9a0a8', '#1f1a1c', '#ffffff', '#2f7f6a'];

  window.burstSparkles = function(x, y, count, power){
    for(let i=0;i<count;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = (power||1)*(1.5+Math.random()*3.5);
      sparkles.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed - 1,
        life: 1,
        decay: 0.012 + Math.random()*0.015,
        color: colors[Math.floor(Math.random()*colors.length)],
        size: 1 + Math.random()*2.2,
        gravity: 0.03
      });
    }
  };

  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.globalCompositeOperation = 'lighter';
    for(let i=sparkles.length-1;i>=0;i--){
      const s = sparkles[i];
      s.x += s.vx; s.y += s.vy; s.vy += s.gravity; s.vx *= 0.99;
      s.life -= s.decay;
      if(s.life <= 0){ sparkles.splice(i,1); continue; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.max(s.life, 0);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

(function petals(){
  const wrap = document.getElementById('petals');
  for(let i=0;i<16;i++){
    const p=document.createElement('div');
    p.className='petal';
    const size=8+Math.random()*10;
    p.style.width=size+'px'; p.style.height=(size*0.8)+'px';
    p.style.left=Math.random()*100+'vw';
    p.style.animationDuration=(9+Math.random()*10)+'s';
    p.style.animationDelay=(Math.random()*10)+'s';
    wrap.appendChild(p);
  }
})();

(function music(){
  const bgm = document.getElementById('bg-music');
  const btn = document.getElementById('musicBtn');
  const start = document.getElementById('startBtn');
  if(!bgm || !btn) return;
  bgm.volume = 0.6;
  let started = false;

  function play(){
    bgm.play().then(()=>{ started = true; btn.classList.add('playing'); btn.classList.remove('off'); })
      .catch(()=>{});
  }
  btn.addEventListener('click', ()=>{
    if(bgm.paused){ play(); }
    else { bgm.pause(); btn.classList.remove('playing'); btn.classList.add('off'); }
  });
  if(start){
    start.addEventListener('click', ()=>{
      if(!started) play();
      if(window.burstSparkles){
        const r = start.getBoundingClientRect();
        window.burstSparkles(r.left+r.width/2, r.top+r.height/2, 35, 1.2);
      }
      document.getElementById('chapters').scrollIntoView({behavior:'smooth'});
    });
  }
})();

(function timelineReveal(){
  const items = [...document.querySelectorAll('.t-item')];
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, {threshold:0.25});
  items.forEach(i=>io.observe(i));
})();

(function gallery(){
  document.querySelectorAll('.polaroid').forEach(card=>{
    card.addEventListener('click', ()=>card.classList.toggle('flipped'));
  });
})();

(function bottle(){
  const bottleEl = document.getElementById('bottleSvg');
  const card = document.getElementById('letterCard');
  const hint = document.getElementById('bottleHint');
  let opened = false;
  bottleEl.addEventListener('click', ()=>{
    if(opened) return; opened = true;
    hint.textContent = 'Suratnya sudah terbuka';
    bottleEl.style.transition = 'transform .4s ease, opacity .4s ease';
    bottleEl.style.transform = 'translateY(-10px) scale(1.05)';
    const rect = bottleEl.getBoundingClientRect();
    if(window.burstSparkles) window.burstSparkles(rect.left+rect.width/2, rect.top+rect.height/2, 40, 1.3);
    setTimeout(()=>{ card.classList.add('show'); }, 200);
  });
})();

(function sendWish(){
  const btn = document.getElementById('sendWishBtn');
  const input = document.getElementById('wishInput');
  const sent = document.getElementById('wishSent');

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5KwBJSbN6U48DMLwNyCMC3rjVHNCTN3MCzGbQaRIx7YQ7SduW_hWZplGYWfE8dsss/exec";

  btn.addEventListener('click', async ()=>{
    const wish = input.value.trim();

    if(!wish) return;

    btn.disabled = true;
    btn.textContent = 'Mengirim...';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          wish: wish
        })
      });

      const rect = btn.getBoundingClientRect();

      if(window.burstSparkles){
        window.burstSparkles(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
          30,
          1.1
        );
      }

      sent.classList.add('show');
      input.value = '';

      setTimeout(()=>{
        sent.classList.remove('show');
      }, 3200);

    } catch(error) {
      console.error('Gagal mengirim wish:', error);
      alert('Wish gagal dikirim. Coba lagi ya.');
    }

    btn.disabled = false;
    btn.textContent = 'Kirim';
  });
})();