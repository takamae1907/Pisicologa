  // Ano automático
  document.getElementById('ano').textContent = new Date().getFullYear();

  // Scroll suave para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
          const id = a.getAttribute('href');
          if (id.length > 1) { e.preventDefault(); document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }); }
      });
  });

  // Aparecer elementos ao rolar
  const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Alternância de tema (respeita preferências do usuário)
  const themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      if (isLight) {
          document.documentElement.style.setProperty('color-scheme', 'light');
          document.body.style.background = 'radial-gradient(1200px 800px at 10% -10%, rgba(122,92,255,.14), transparent 50%),radial-gradient(1000px 600px at 90% 0%, rgba(0,200,255,.12), transparent 50%),linear-gradient(180deg, var(--bg), var(--bg2))';
      } else {
          document.documentElement.style.removeProperty('color-scheme');
          document.body.style.background = '';
      }
  });

  // Formulário: validação simples + WhatsApp
  const form = document.getElementById('contatoForm');
  const zapLink = document.getElementById('zapLink');
  const toast = document.querySelector('.toast');

  const ZAP_NUMERO = '5500000000000'; // <-- Ajuste aqui (formato 55DDDNUMERO, sem símbolos)

  function emailValido(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function mostrarToast(msg) {
      const bubble = toast.querySelector('.bubble');
      bubble.textContent = msg;
      toast.hidden = false; bubble.style.opacity = 1;
      setTimeout(() => { bubble.style.transition = 'opacity .6s'; bubble.style.opacity = 0; setTimeout(() => toast.hidden = true, 650); }, 1800);
  }

  form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const instrumento = form.instrumento.value;
      const mensagem = form.mensagem.value.trim();

      if (!nome) { mostrarToast('Digite seu nome'); return; }
      if (!emailValido(email)) { mostrarToast('E-mail inválido'); return; }
      if (!instrumento) { mostrarToast('Escolha um instrumento'); return; }

      const texto = `Olá, sou ${nome}.\nQuero aulas de ${instrumento}.\nE-mail: ${email}.\nMensagem: ${mensagem || '—'}`;
      const url = `https://wa.me/${ZAP_NUMERO}?text=${encodeURIComponent(texto)}`;
      zapLink.href = url; zapLink.click();
      mostrarToast('Abrindo WhatsApp…');
      form.reset();
  });