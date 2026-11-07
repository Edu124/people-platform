// Shared header + footer for public pages. Each page sets <body data-page="home|service|estimate">.
(() => {
  const page = document.body.dataset.page;
  const header = document.createElement('header');
  header.className = 'nav';
  header.innerHTML = `<div class="wrap nav-in">
    <a class="logo" href="index.html"><span class="logo-mark">${FIRM.name[0]}</span> ${FIRM.name.split(' ')[0]} <small>${FIRM.name.split(' ').slice(1).join(' ')}</small></a>
    <nav class="nav-links">
      <div class="drop"><button type="button">Services ${icon('arrow', 'icon')}</button>
        <div class="card drop-menu">${PILLARS.map(p => `<a href="service.html#${p.id}" style="text-decoration:none"><span class="ic c-${p.color}">${icon(p.icon)}</span>${p.name}</a>`).join('')}</div></div>
      <a href="index.html#how" >How we work</a>
      <a href="index.html#pricing">Pricing models</a>
      <a href="estimate.html" class="${page === 'estimate' ? 'on' : ''}">Build your plan</a>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-ghost btn-sm" href="app.html">Client portal demo</a>
      <a class="btn btn-primary btn-sm" href="estimate.html">Get an estimate</a>
    </div></div>`;
  document.body.prepend(header);
  header.querySelector('.drop button .icon').style.cssText = 'width:14px;height:14px;transform:rotate(90deg)';

  const footer = document.createElement('footer');
  footer.className = 'wrap foot';
  footer.innerHTML = `<span>© 2026 ${FIRM.name}. Prices shown are illustrative.</span><span>${PILLARS.map(p => `<a href="service.html#${p.id}" style="text-decoration:none;margin-left:12px">${p.name}</a>`).join('')}</span>`;
  document.body.append(footer);
})();
