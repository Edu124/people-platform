/* Nakshatra People — workspace app (vanilla JS, hash-routed, local demo state) */
(() => {
  const TODAY = new Date('2026-11-06T00:00:00');
  const KEY = 'tenet-people-demo-v1';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');
  const lakh = (n) => n >= 1e7 ? '₹' + (n / 1e7).toFixed(2) + ' Cr' : '₹' + (n / 1e5).toFixed(1) + ' L';
  const initials = (n) => n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const daysTo = (d) => Math.round((new Date(d + 'T00:00:00') - TODAY) / 864e5);
  const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  // ---------- state ----------
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY)) || clone(SEED); } catch { S = clone(SEED); }
  S.automations ||= [
    { name: 'Auto-create onboarding checklist on offer accept', on: true },
    { name: 'Remind owners 7 days before statutory due dates', on: true },
    { name: 'Escalate helpdesk tickets older than 48h', on: true },
    { name: 'Send pulse survey to new joiners at day 30 / 90', on: false },
    { name: 'Flag contractor PF/ESI mismatches each month', on: true },
  ];
  S.site ||= 'All sites';
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* storage unavailable */ } };

  // ---------- ui helpers ----------
  const toast = (msg) => {
    const t = $('#toast'); t.innerHTML = icon('check') + esc(msg); t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400);
  };
  const modal = (html, onSubmit) => {
    $('#modal').innerHTML = html; $('#modalBg').classList.add('open');
    const f = $('#modal form');
    f?.querySelector('input,select')?.focus();
    f?.addEventListener('submit', (e) => { e.preventDefault(); if (onSubmit(new FormData(f)) !== false) closeModal(); });
    $('#modal [data-close]')?.addEventListener('click', closeModal);
  };
  const closeModal = () => $('#modalBg').classList.remove('open');
  $('#modalBg').addEventListener('click', e => { if (e.target.id === 'modalBg') closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  const statusChip = (s) => {
    const m = { Active: 'green', Approved: 'green', Done: 'green', Filed: 'green', Resolved: 'green', Low: 'green', Verified: 'green', Valid: 'green', 'Ready now': 'green',
      Pending: 'amber', Due: 'amber', Probation: 'blue', 'In progress': 'blue', Medium: 'amber', Open: 'amber',
      Notice: 'red', Overdue: 'red', Rejected: 'red', High: 'red', Mismatch: 'red', 'No successor': 'red' };
    return `<span class="chip ${m[s] || ''}">${esc(s)}</span>`;
  };
  const bar = (pct, color) => `<div class="bar"><i style="width:${Math.max(0, Math.min(100, pct))}%;${color ? 'background:' + color : ''}"></i></div>`;
  const person = (name, sub) => `<div class="person"><span class="avatar">${initials(name)}</span><div><b>${esc(name)}</b><span>${esc(sub)}</span></div></div>`;
  const siteMatch = (site) => S.site === 'All sites' || site === S.site || site === 'All sites' || (site || '').includes(S.site.split(' ')[0]);

  // tiny SVG charts
  function lineChart(values, labels, { h = 180, color = '#1d8a68', suffix = '' } = {}) {
    const w = 560, pad = 28, min = Math.min(...values), max = Math.max(...values), span = (max - min) || 1;
    const x = (i) => pad + i * (w - pad * 2) / (values.length - 1);
    const y = (v) => h - pad - (v - min) / span * (h - pad * 2);
    const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto" role="img" aria-label="Trend chart">
      ${[0, .5, 1].map(f => `<line x1="${pad}" x2="${w - pad}" y1="${pad + f * (h - pad * 2)}" y2="${pad + f * (h - pad * 2)}" stroke="#e2e0d8" stroke-dasharray="3 4"/>`).join('')}
      <polygon points="${x(0)},${h - pad} ${pts} ${x(values.length - 1)},${h - pad}" fill="${color}" opacity=".1"/>
      <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>
      ${values.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${i === values.length - 1 ? 4.5 : 2.5}" fill="${color}"><title>${labels[i]}: ${v}${suffix}</title></circle>`).join('')}
      ${labels.map((l, i) => `<text x="${x(i)}" y="${h - 6}" font-size="11" fill="#6b7484" text-anchor="middle">${l}</text>`).join('')}
      <text x="${x(values.length - 1)}" y="${y(values[values.length - 1]) - 10}" font-size="12" font-weight="700" fill="${color}" text-anchor="end">${values[values.length - 1]}${suffix}</text>
    </svg>`;
  }
  function hbars(rows, color = '#1d8a68') {
    const max = Math.max(...rows.map(r => r[1]));
    return rows.map(([l, v, sub]) => `<div style="margin:10px 0">
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span>${esc(l)}</span><b>${sub ?? v}</b></div>
      ${bar(v / max * 100, color)}</div>`).join('');
  }
  const ring = (pct, label, color = '#1d8a68') => {
    const r = 56, c = 2 * Math.PI * r;
    return `<div class="ring"><svg width="132" height="132"><circle cx="66" cy="66" r="${r}" stroke="#efeee8" stroke-width="12" fill="none"/>
      <circle cx="66" cy="66" r="${r}" stroke="${color}" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" style="transition:stroke-dashoffset .6s"/></svg>
      <div><div><strong>${pct}%</strong><span>${label}</span></div></div></div>`;
  };

  // ---------- derived metrics ----------
  const M = {
    headcount: () => S.employees.length + 600, // 12 named profiles + 600 others in tenant
    pendingLeaves: () => S.leaves.filter(l => l.status === 'Pending').length,
    openTickets: () => S.tickets.filter(t => t.status !== 'Resolved').length,
    overdue: () => S.compliance.filter(k => k.status !== 'Done' && daysTo(k.due) < 0).length,
    complianceScore: () => {
      const items = S.compliance, bad = items.filter(k => k.status !== 'Done' && daysTo(k.due) < 0).length;
      const risky = S.contractors.filter(c => c.risk === 'High').length;
      return Math.max(0, Math.round(100 - bad * 6 - risky * 3));
    },
    openPositions: () => S.requisitions.reduce((a, r) => a + r.openings - r.filled, 0),
    learning: () => Math.round(S.cohorts.reduce((a, c) => a + c.completion * c.enrolled, 0) / S.cohorts.reduce((a, c) => a + c.enrolled, 0)),
  };

  // ---------- navigation ----------
  const ROUTES = [
    { id: 'overview', name: 'Home: this month', icon: 'home' },
    ...PILLARS.map(p => ({ id: p.id, name: p.name, icon: p.icon, pillar: true })),
    { id: 'billing', name: 'Plan & invoice', icon: 'receipt' },
  ];
  function renderNav(active) {
    const badge = { hrms: M.pendingLeaves() + (S.payroll.status === 'Draft' ? 1 : 0), compliance: M.overdue() };
    $('#nav').innerHTML = ROUTES.map((r, i) =>
      (i === 1 ? '<div class="side-label">Our 7 services</div>' : '') +
      (r.id === 'billing' ? '<div class="side-label">Commercials</div>' : '') +
      `<a class="nav-item ${r.id === active ? 'on' : ''}" href="#${r.id}">${icon(r.icon)}<span>${r.pillar ? `<small style="opacity:.55;margin-right:4px">${i}</small>` : ''}${r.name}</span>${badge[r.id] ? `<span class="badge" title="Items waiting for the client">${badge[r.id]}</span>` : ''}</a>`
    ).join('');
  }
  $('#orgName').textContent = S.org.name;
  $('#orgPlan').textContent = S.org.plan;
  $('#menuBtn').innerHTML = icon('menu');
  $('#menuBtn').onclick = (e) => { e.stopPropagation(); $('#side').classList.toggle('open'); };
  document.addEventListener('click', e => { if (!e.target.closest('#side')) $('#side').classList.remove('open'); });
  S.site = 'All sites';
  $('#resetDemo').onclick = (e) => { e.preventDefault(); try { localStorage.removeItem(KEY); } catch {} location.hash = '#overview'; location.reload(); };

  // ---------- "How this demo works" guide ----------
  function showGuide() {
    modal(`<h3>How to read this demo</h3>
      <p style="color:var(--ink-2);margin:-6px 0 14px">This is the <b>client portal</b>: the software a client organisation uses once they have hired us for one or more of our seven services.</p>
      <div class="guide-step"><span class="n">1</span><div><b>The client:</b> Meridian Components, a sample manufacturer with 612 employees across 4 sites. All names and numbers are made up.</div></div>
      <div class="guide-step"><span class="n">2</span><div><b>The left menu = our 7 services.</b> Each page shows one service as the client experiences it.</div></div>
      <div class="guide-step"><span class="n">3</span><div><b>The green box at the top of every page</b> explains what the page shows, what <i>our team</i> does behind it, and what <i>the client</i> does.</div></div>
      <div class="guide-step"><span class="n">4</span><div><b>Try the buttons.</b> Approve payroll or leave, move a candidate forward, mark a filing done. Nothing is sent anywhere; "Reset demo data" in the menu restores it.</div></div>
      <div class="foot"><a class="btn btn-ghost btn-sm" href="index.html">Read about the services first</a><button class="btn btn-primary btn-sm" data-close>Start exploring</button></div>`);
  }
  $('#guideBtn').onclick = showGuide;
  try { if (!localStorage.getItem(KEY + '-guided')) { localStorage.setItem(KEY + '-guided', '1'); setTimeout(showGuide, 300); } } catch { setTimeout(showGuide, 300); }

  // ---------- per-page explanation: what it is / what our team does / what the client does ----------
  const EXPLAIN = {
    overview: { what: 'The client\'s home page: decisions waiting for them today, and a one-line status for every service we deliver.', team: 'Prepares everything in advance, so the client only has to approve or review.', you: 'Clear the approvals list, then glance at each service card.' },
    hrms: { what: 'Day-to-day HR and payroll for all 612 employees.', team: 'Collects attendance, processes payroll and statutory deductions, answers employee tickets, and handles joinings and exits.', you: 'Approve payroll before salaries are paid, approve leave, and check helpdesk response times.' },
    talent: { what: 'Every open position and every candidate we are working on.', team: 'Sources, screens and interviews candidates, moves them through each stage, negotiates offers and runs onboarding.', you: 'Raise hiring requests, review shortlisted candidates and approve offers.' },
    compliance: { what: 'Labour-law compliance across all sites and contractors, with an audit-readiness score.', team: 'Files every statutory return on time, checks contractors monthly, keeps POSH records and stores proof of everything.', you: 'Check the score and calendar, and download proof when an inspector or auditor asks.' },
    od: { what: 'Organisation-design projects and employee engagement results.', team: 'Runs the redesign projects and pulse surveys, and turns the results into recommendations.', you: 'Track each project phase, read the insights and decide on the recommended actions.' },
    learning: { what: 'Training programmes and cohorts for employees.', team: 'Designs and delivers each programme, tracks attendance and measures skill improvement.', you: 'Nominate employees to programmes and follow their completion.' },
    rewards: { what: 'Pay bands compared with the market, performance ratings and succession for critical roles.', team: 'Benchmarks salaries, builds pay bands, runs the performance cycle and assesses successors.', you: 'Spot where pay is out of line and which critical roles lack a successor, then decide what to fix.' },
    tech: { what: 'People dashboards, automations and connected systems.', team: 'Sets up and maintains the HR system, integrations, automations and dashboards.', you: 'Use the dashboards in leadership reviews and switch automations on or off.' },
    billing: { what: 'The services this client has signed up for and this month\'s invoice.', team: 'Bills each service according to its agreed fee model, with no hidden charges.', you: 'See exactly what you pay for and why, and add services when needed.' },
  };
  function explainBox(id) {
    const e = EXPLAIN[id], p = PILLARS.find(x => x.id === id);
    return `<div class="card explain"><div class="explain-grid">
      <div><b>${icon('file')} What this page shows</b>${e.what}</div>
      <div><b style="color:var(--brand)">${icon('users')} What our team does</b>${e.team}</div>
      <div><b style="color:#8a611c">${icon('check')} What the client does</b>${e.you}</div></div>
      ${p ? `<div class="explain-foot"><span style="font-weight:600">Service lines:</span>${p.lines.map(l => `<span class="chip">${l.name}</span>`).join('')}<a href="service.html#${p.id}">Full service details →</a></div>` : ''}</div>`;
  }

  const state = { hrmsTab: 'payroll', q: '', talentTab: 'pipeline', compTab: 'calendar' };

  const head = (eyebrow, title, sub, actions = '') =>
    `<div class="page-head"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${sub}</p></div><div class="actions">${actions}</div></div>`;
  const tabs = (key, list) => `<div class="tabs" data-tabs="${key}">${list.map(([id, l]) => `<button data-tab="${id}" class="${state[key] === id ? 'on' : ''}">${l}</button>`).join('')}</div>`;
  const pillarOf = (id) => PILLARS.find(p => p.id === id);
  const pillarHead = (id, _title, _sub, actions = '') => {
    const p = pillarOf(id);
    return head(`Service ${PILLARS.indexOf(p) + 1} of 7`, p.name, p.short, actions) + explainBox(id);
  };

  // ---------- views ----------
  const V = {};

  V.overview = () => {
    const P = S.payroll;
    const approvals = [
      ...(P.status !== 'Disbursed' ? [{ ic: 'wallet', c: 'brand', svc: 'HR Managed Services', t: `November payroll for ${P.employees} employees`, s: `Our team has prepared it (stage: ${P.status}). It needs your go-ahead before salaries are paid.`, btn: `<a class="btn btn-primary btn-sm" href="#hrms" data-goto="payroll">Review payroll</a>` }] : []),
      ...S.leaves.filter(l => l.status === 'Pending').map(l => ({ ic: 'calendar', c: 'brand', svc: 'HR Managed Services', t: `${l.emp}: ${l.days} days ${l.type.toLowerCase()} leave`, s: `${fmtDate(l.from)} – ${fmtDate(l.to)} · ${l.reason}`, btn: `<button class="btn btn-ghost btn-sm" data-approve="${l.id}">Approve</button>` })),
      ...S.candidates.filter(c => c.stage === 'Offer').map(c => ({ ic: 'briefcase', c: 'blue', svc: 'Workforce & Talent', t: `Offer accepted: ${c.name}`, s: `For ${S.requisitions.find(r => r.id === c.req)?.title}. Confirm the joining to start onboarding.`, btn: `<button class="btn btn-ghost btn-sm" data-advance="${c.id}">Confirm joining</button>` })),
    ];
    const flags = [
      ...S.compliance.filter(k => k.status !== 'Done' && daysTo(k.due) < 0).map(k => ({ t: k.item, s: `Overdue by ${-daysTo(k.due)} days. Our team is fixing it today.`, c: 'red' })),
      ...S.contractors.filter(c => c.risk === 'High').map(c => ({ t: `Contractor: ${c.vendor}`, s: 'PF/ESI records do not match. We are checking with the vendor.', c: 'red' })),
      ...S.tickets.filter(t => t.status !== 'Resolved' && t.age > 3).map(t => ({ t: `Helpdesk ${t.id} is past its response time`, s: t.topic, c: 'amber' })),
    ];
    const avgPulse = Math.round(S.pulse.reduce((a, p) => a + p.score, 0) / S.pulse.length);
    const done = {
      hrms: [`Payroll: ${P.status === 'Disbursed' ? 'paid and payslips sent' : 'prepared, awaiting your approval'}`, `${S.tickets.filter(t => t.status === 'Resolved').length} of ${S.tickets.length} employee queries resolved`, `${M.pendingLeaves()} leave request(s) waiting for you`],
      talent: [`${M.openPositions()} positions being filled across ${S.requisitions.length} roles`, `${S.candidates.filter(c => c.stage === 'Joined').length} new joiner(s) onboarded`, `${S.candidates.filter(c => ['Interview', 'Offer'].includes(c.stage)).length} candidates at interview / offer`],
      compliance: [`${S.compliance.filter(k => k.status === 'Done').length} filing(s) completed, ${S.compliance.filter(k => k.status !== 'Done').length} scheduled`, `${M.overdue()} overdue item(s)`, `Audit-readiness score: ${M.complianceScore()}%`],
      od: [`${S.odProjects.length} redesign projects in progress`, `October pulse survey: ${avgPulse}% favourable`],
      learning: [`${S.cohorts.length} programmes running, ${S.cohorts.reduce((a, c) => a + c.enrolled, 0)} learners`, `Average completion ${M.learning()}%`],
      rewards: ['Salary benchmarking refreshed for 6 grades', `${S.succession.filter(s => s.risk === 'High').length} critical role without a successor`],
      tech: [`${S.automations.filter(a => a.on).length} automations running`, 'Headcount & attrition dashboards refreshed'],
    };
    return head(`${S.org.name} · ${TODAY.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 'This month at a glance', 'Our team does the work in each service. This page shows what needs your decision and what was delivered.') +
    explainBox('overview') +
    `<div class="grid g2">
      <div class="card panel"><div class="panel-h"><h3>Waiting for your approval</h3><span class="chip amber">${approvals.length}</span></div>
        ${approvals.map(a => `<div class="list-row"><span class="ic-sq" style="background:var(--${a.c}-soft);color:var(--${a.c})">${icon(a.ic)}</span><div class="grow"><b>${esc(a.t)}</b><span>${a.svc} · ${esc(a.s)}</span></div>${a.btn}</div>`).join('') || '<p class="empty">Nothing waiting. You are all caught up.</p>'}
      </div>
      <div class="card panel"><div class="panel-h"><h3>Flagged by our team</h3><span class="chip red">${flags.length}</span></div>
        ${flags.map(f => `<div class="list-row"><span class="ic-sq" style="background:var(--${f.c}-soft);color:var(--${f.c})">${icon('alert')}</span><div class="grow"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></div></div>`).join('') || '<p class="empty">No risks flagged.</p>'}
        <p style="font-size:12px;color:var(--muted);margin:10px 0 0">No action needed from you. These are shown so nothing is hidden.</p>
      </div>
    </div>
    <div class="panel-h" style="margin-top:28px"><h3>What we delivered in each service this month</h3><span class="sub">Click a service to see the detail</span></div>
    <div class="grid g3">${PILLARS.map((p, i) => `<a class="card svc-card" href="#${p.id}">
      <h4><span class="ic-sq" style="background:var(--surface-2)">${icon(p.icon)}</span><span><span class="lbl">Service ${i + 1}</span><br>${p.name}</span></h4>
      <ul>${done[p.id].map(d => `<li>${d}</li>`).join('')}</ul></a>`).join('')}
      <a class="card svc-card" href="#billing"><h4><span class="ic-sq" style="background:var(--gold-soft);color:var(--gold)">${icon('receipt')}</span><span><span class="lbl">Commercials</span><br>Plan &amp; invoice</span></h4>
      <ul><li>${S.engagements.length} services billed this month</li><li>See each fee model and amount</li></ul></a>
    </div>`;
  };

  // ----- HR Managed Services -----
  V.hrms = () => {
    const t = state.hrmsTab;
    let body = '';
    if (t === 'people') {
      const q = state.q.toLowerCase();
      const list = S.employees.filter(e => siteMatch(e.site) && (!q || (e.name + e.role + e.dept + e.id).toLowerCase().includes(q)));
      body = `<div class="card panel"><div class="panel-h"><h3>Employee directory</h3>
        <label class="search" style="max-width:280px;flex:none">${icon('search')}<input id="peopleQ" value="${esc(state.q)}" placeholder="Filter by name, role, dept" aria-label="Filter employees"></label></div>
        <div class="table-wrap"><table class="t"><thead><tr><th>Employee</th><th>Department</th><th>Site</th><th>Grade</th><th class="num">Annual CTC</th><th>Status</th></tr></thead><tbody>
        ${list.map(e => `<tr><td>${person(e.name, e.id + ' · ' + e.role)}</td><td>${esc(e.dept)}</td><td>${esc(e.site)}</td><td>${esc(e.grade)}</td><td class="num">${inr(e.ctc)}</td><td>${statusChip(e.status)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">No employees match.</td></tr>'}
        </tbody></table></div><p style="color:var(--muted);font-size:12px;margin:12px 0 0">Showing ${list.length} named profiles of ${M.headcount()} employees (sample data).</p></div>`;
    }
    if (t === 'leave') {
      body = `<div class="grid g21"><div class="card panel"><div class="panel-h"><h3>Leave requests</h3><span class="sub">${M.pendingLeaves()} awaiting approval</span></div>
        <div class="table-wrap"><table class="t"><thead><tr><th>Employee</th><th>Type</th><th>Dates</th><th class="num">Days</th><th>Status</th><th></th></tr></thead><tbody>
        ${S.leaves.map(l => `<tr><td>${person(l.emp, l.reason)}</td><td>${l.type}</td><td>${fmtDate(l.from)} – ${fmtDate(l.to)}</td><td class="num">${l.days}</td><td>${statusChip(l.status)}</td>
          <td style="white-space:nowrap">${l.status === 'Pending' ? `<button class="btn btn-brand btn-sm" data-approve="${l.id}">Approve</button> <button class="btn btn-ghost btn-sm" data-reject="${l.id}">Reject</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div></div>
        <div class="card panel"><div class="panel-h"><h3>Today's attendance</h3><span class="sub">Biometric + mobile</span></div>
        ${ring(94, 'present')}<div style="margin-top:14px">${hbars([['Pune Plant', 96, '96%'], ['Chakan Plant', 92, '92%'], ['Mumbai HQ', 89, '89%'], ['Bengaluru R&D', 95, '95%']])}</div></div></div>`;
    }
    if (t === 'payroll') {
      const P = S.payroll, flow = ['Draft', 'Validated', 'Approved', 'Disbursed'], idx = flow.indexOf(P.status);
      const next = { Draft: 'Run validation', Validated: 'Send for CFO approval', Approved: 'Disburse salaries' }[P.status];
      body = `<div class="card panel"><div class="panel-h"><h3>Payroll run · ${P.month}</h3>${statusChip(P.status === 'Disbursed' ? 'Done' : 'In progress')}</div>
        <div class="steps">${flow.map((f, i) => `<div class="step ${i < idx ? 'done' : i === idx ? 'cur' : ''}"><i>${i < idx ? '✓' : i + 1}</i>${f}</div>`).join('')}</div>
        <div class="grid g4">
          <div class="tile" style="background:var(--bg);border-radius:12px"><small>Employees</small><strong>${P.employees}</strong></div>
          <div class="tile" style="background:var(--bg);border-radius:12px"><small>Gross pay</small><strong>${lakh(P.gross)}</strong></div>
          <div class="tile" style="background:var(--bg);border-radius:12px"><small>Statutory (PF, ESI, PT, TDS)</small><strong>${lakh(P.statutory)}</strong></div>
          <div class="tile" style="background:var(--bg);border-radius:12px"><small>Net payable</small><strong>${lakh(P.gross - P.deductions)}</strong></div>
        </div>
        ${P.exceptions && P.status === 'Draft' ? `<div class="note mt">${icon('alert')} ${P.exceptions} exceptions found: 2 missing bank IFSC codes, 1 overtime entry above policy cap. Validation fixes them before approval.</div>` : ''}
        <div class="actions mt">${next ? `<button class="btn btn-primary" id="payNext">${next}</button>` : `<span class="chip green">${icon('check')} Salaries credited · payslips sent to ${P.employees} employees</span>`}
        <button class="btn btn-ghost" id="payReg">${icon('file')} Download register (demo)</button></div></div>`;
    }
    if (t === 'helpdesk') {
      body = `<div class="card panel"><div class="panel-h"><h3>HR helpdesk</h3><span class="sub">SLA: first response in 24h · resolution in 72h</span></div>
        <div class="table-wrap"><table class="t"><thead><tr><th>Ticket</th><th>Category</th><th>Raised by</th><th>Age</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>
        ${S.tickets.map(tk => `<tr><td><b>${tk.id}</b><br><span style="color:var(--ink-2)">${esc(tk.topic)}</span></td><td>${tk.cat}</td><td>${esc(tk.emp)}</td><td>${tk.age}d ${tk.age > 3 && tk.status !== 'Resolved' ? '<span class="chip red">SLA breach</span>' : ''}</td><td>${statusChip(tk.priority)}</td><td>${statusChip(tk.status)}</td>
          <td>${tk.status !== 'Resolved' ? `<button class="btn btn-ghost btn-sm" data-resolve="${tk.id}">Resolve</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div></div>`;
    }
    return pillarHead('hrms', null, 'Payroll, attendance, leave, lifecycle and helpdesk, run accurately every month.',
      `<button class="btn btn-primary btn-sm" id="addEmp">${icon('plus')} Add employee</button>`) +
      tabs('hrmsTab', [['payroll', 'Payroll administration'], ['leave', 'Attendance & leave'], ['helpdesk', `HR helpdesk (${M.openTickets()})`], ['people', 'Employee records']]) + body;
  };

  // ----- Workforce & Talent -----
  const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Joined'];
  V.talent = () => {
    const reqs = S.requisitions.filter(r => siteMatch(r.site));
    const t = state.talentTab;
    let body;
    if (t === 'pipeline') {
      body = `<div class="kanban" style="grid-template-columns:repeat(5,minmax(180px,1fr))">${STAGES.map(st => {
        const cs = S.candidates.filter(c => c.stage === st);
        return `<div class="col"><h4>${st}<span>${cs.length}</span></h4>${cs.map(c => {
          const r = S.requisitions.find(x => x.id === c.req);
          return `<div class="kcard"><b>${esc(c.name)}</b><span>${esc(r?.title || c.req)}</span><div class="row"><span>Fit ${c.score} · ${esc(c.source)}</span>${st !== 'Joined' ? `<button data-advance="${c.id}" title="Move to next stage">→</button>` : icon('check')}</div></div>`;
        }).join('') || '<p class="empty" style="font-size:12px">No candidates</p>'}</div>`;
      }).join('')}</div>`;
    } else {
      const bySite = S.org.sites.map(s => [s, S.requisitions.filter(r => r.site === s).reduce((a, r) => a + r.openings - r.filled, 0)]).filter(r => r[1] > 0);
      body = `<div class="grid g2"><div class="card panel"><div class="panel-h"><h3>Open positions by site</h3></div>${hbars(bySite, '#2b5ea8')}</div>
        <div class="card panel"><div class="panel-h"><h3>FY27 workforce plan</h3><span class="sub">Approved vs actual</span></div>
        ${[['Operations', 430, 412], ['R&D', 70, 61], ['Sales', 48, 44], ['Support functions', 92, 95]].map(([d, plan, act]) => `<div style="margin:12px 0"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span>${d}</span><span>${act} / ${plan} ${act > plan ? '<span class="chip red">over plan</span>' : ''}</span></div>${bar(act / plan * 100, act > plan ? 'var(--red)' : '')}</div>`).join('')}</div></div>`;
    }
    return pillarHead('talent', null, 'Permanent, volume and leadership hiring, RPO, workforce planning and onboarding.',
      `<button class="btn btn-primary btn-sm" id="addReq">${icon('plus')} New requisition</button>`) +
      `<div class="grid g4">
        <div class="card tile"><small>Open positions</small><strong>${M.openPositions()}</strong></div>
        <div class="card tile"><small>Avg time-to-fill</small><strong>21 days</strong><span class="delta up">▼ 6 days vs last quarter</span></div>
        <div class="card tile"><small>Offer acceptance</small><strong>86%</strong></div>
        <div class="card tile"><small>90-day retention</small><strong>92%</strong></div>
      </div>
      <div class="card panel mt"><div class="panel-h"><h3>Requisitions</h3><span class="sub">${S.site}</span></div><div class="table-wrap"><table class="t">
      <thead><tr><th>Role</th><th>Type</th><th>Site</th><th>Progress</th><th class="num">Age</th><th class="num">Budget CTC</th></tr></thead><tbody>
      ${reqs.map(r => `<tr><td><b>${esc(r.title)}</b><br><span style="color:var(--muted);font-size:12px">${r.id}</span></td><td>${statusChipType(r.type)}</td><td>${esc(r.site)}</td>
        <td style="min-width:140px"><div style="font-size:12px;margin-bottom:4px">${r.filled} of ${r.openings} filled</div>${bar(r.filled / r.openings * 100, '#2b5ea8')}</td><td class="num">${r.ageDays}d</td><td class="num">${inr(r.budget)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">No requisitions at this site.</td></tr>'}
      </tbody></table></div></div>
      <div style="margin-top:20px">${tabs('talentTab', [['pipeline', 'Candidate pipeline'], ['plan', 'Workforce planning']])}${body}</div>`;
  };
  const statusChipType = (t) => `<span class="chip ${{ Volume: 'blue', 'Leadership search': 'violet', Permanent: 'green', RPO: 'gold' }[t] || ''}">${esc(t)}</span>`;

  // ----- Compliance & Risk -----
  V.compliance = () => {
    const t = state.compTab, cs = M.complianceScore();
    let body;
    if (t === 'calendar') {
      const items = S.compliance.filter(k => siteMatch(k.site)).sort((a, b) => (a.status === 'Done') - (b.status === 'Done') || a.due.localeCompare(b.due));
      body = `<div class="card panel"><div class="panel-h"><h3>Statutory calendar</h3><span class="sub">Owners get reminders 7 days before each due date</span></div><div class="table-wrap"><table class="t">
        <thead><tr><th>Obligation</th><th>Law</th><th>Site</th><th>Owner</th><th>Due</th><th>Status</th><th></th></tr></thead><tbody>
        ${items.map(k => {
          const d = daysTo(k.due), st = k.status === 'Done' ? 'Done' : d < 0 ? 'Overdue' : 'Due';
          return `<tr><td><b>${esc(k.item)}</b></td><td>${esc(k.law)}</td><td>${esc(k.site)}</td><td>${esc(k.owner)}</td><td>${fmtDate(k.due)}<br><span style="font-size:12px;color:${d < 0 && st !== 'Done' ? 'var(--red)' : 'var(--muted)'}">${st === 'Done' ? 'filed' : d < 0 ? -d + 'd overdue' : 'in ' + d + 'd'}</span></td><td>${statusChip(st)}</td>
          <td>${st !== 'Done' ? `<button class="btn btn-ghost btn-sm" data-file="${k.id}">Mark filed</button>` : ''}</td></tr>`;
        }).join('')}</tbody></table></div></div>`;
    } else if (t === 'contractors') {
      body = `<div class="card panel"><div class="panel-h"><h3>Contractor governance</h3><span class="sub">CLRA · monthly PF/ESI/wage verification</span></div><div class="table-wrap"><table class="t">
        <thead><tr><th>Vendor</th><th>Site</th><th class="num">Workers</th><th>Licence</th><th>PF</th><th>ESI</th><th>Min. wages</th><th>Risk</th><th></th></tr></thead><tbody>
        ${S.contractors.map((c, i) => `<tr><td><b>${esc(c.vendor)}</b></td><td>${esc(c.site)}</td><td class="num">${c.heads}</td><td>${statusChip(c.licence)}</td><td>${statusChip(c.pf)}</td><td>${statusChip(c.esi)}</td><td>${statusChip(c.wages)}</td><td>${statusChip(c.risk)}</td>
          <td>${c.risk !== 'Low' ? `<button class="btn btn-ghost btn-sm" data-verify="${i}">Verify</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div></div>`;
    } else {
      body = `<div class="grid g3">
        <div class="card panel"><div class="panel-h"><h3>Internal Committee</h3>${statusChip('Active')}</div>
          ${['Presiding Officer · Meera Joshi', 'Member · Ananya Kulkarni', 'Member · Imran Khan', 'External member · Adv. R. Sathe (NGO)'].map(m => `<div class="list-row"><span class="ic-sq" style="background:var(--violet-soft);color:var(--violet)">${icon('users')}</span><div class="grow"><b>${m.split(' · ')[1]}</b><span>${m.split(' · ')[0]}</span></div></div>`).join('')}</div>
        <div class="card panel"><div class="panel-h"><h3>Awareness training</h3></div>${ring(87, 'trained', '#6a4fa3')}<p style="color:var(--ink-2);margin:14px 0 0">532 of 612 employees completed POSH awareness this year. Plant floor sessions run in Marathi and Hindi.</p></div>
        <div class="card panel"><div class="panel-h"><h3>Case register</h3><span class="chip"><span id="lk"></span>Confidential</span></div>
          <div class="list-row"><div class="grow"><b>Complaints received (FY)</b></div><b>2</b></div>
          <div class="list-row"><div class="grow"><b>Resolved within 90 days</b></div><b>2</b></div>
          <div class="list-row"><div class="grow"><b>Open</b></div><b>0</b></div>
          <div class="list-row"><div class="grow"><b>Annual report to District Officer</b></div>${statusChip('Due')}</div></div>
      </div>`;
    }
    return pillarHead('compliance', null, 'Statutory calendar, audit readiness, contractor governance, policy and POSH.',
      `<button class="btn btn-primary btn-sm" id="auditPack">${icon('file')} Generate audit pack</button>`) +
      `<div class="grid g12"><div class="card panel" style="display:flex;gap:20px;align-items:center">${ring(cs, 'audit-ready', cs > 90 ? '#1d8a68' : '#b9771a')}
        <div><h3 style="font-size:15px">Audit readiness</h3><p style="color:var(--ink-2);margin:6px 0 0;font-size:13px">Based on overdue filings, contractor risk and evidence on file across ${S.org.sites.length} sites.</p></div></div>
        <div class="grid g3">
          <div class="card tile"><small>Overdue filings</small><strong class="${M.overdue() ? 'down' : ''}">${M.overdue()}</strong></div>
          <div class="card tile"><small>Due in next 30 days</small><strong>${S.compliance.filter(k => k.status !== 'Done' && daysTo(k.due) >= 0 && daysTo(k.due) <= 30).length}</strong></div>
          <div class="card tile"><small>High-risk contractors</small><strong>${S.contractors.filter(c => c.risk === 'High').length}</strong></div>
        </div></div>
      <div style="margin-top:20px">${tabs('compTab', [['calendar', 'Statutory calendar'], ['contractors', 'Contractor governance'], ['posh', 'POSH framework']])}${body}</div>`;
  };

  // ----- OD & Transformation -----
  V.od = () => {
    const phases = ['Diagnose', 'Design', 'Pilot', 'Embed'];
    const avg = Math.round(S.pulse.reduce((a, p) => a + p.score, 0) / S.pulse.length);
    return pillarHead('od', null, 'Organisation design, role clarity, operating model, culture, engagement and change.',
      `<button class="btn btn-primary btn-sm" id="launchPulse">${icon('heart')} Launch pulse survey</button>`) +
      `<div class="grid g3">${S.odProjects.map(p => {
        const idx = phases.indexOf(p.phase);
        return `<div class="card panel"><span class="chip violet">${esc(p.client)}</span><h3 style="font-size:16px;margin:12px 0 4px">${esc(p.name)}</h3>
          <p style="color:var(--muted);margin:0 0 14px;font-size:12px">Lead: ${esc(p.lead)} · due ${fmtDate(p.due)}</p>
          <div class="steps" style="margin-bottom:10px">${phases.map((f, i) => `<div class="step ${i < idx ? 'done' : i === idx ? 'cur' : ''}"><i>${i < idx ? '✓' : i + 1}</i>${f}</div>`).join('')}</div>
          ${bar(p.progress, '#6a4fa3')}<div style="font-size:12px;color:var(--muted);margin-top:6px">${p.progress}% complete</div></div>`;
      }).join('')}</div>
      <div class="grid g21 mt">
        <div class="card panel"><div class="panel-h"><h3>Engagement pulse · October</h3><span class="sub">n = 438 · 72% response</span></div>
          ${S.pulse.map(p => `<div style="margin:12px 0"><div style="display:flex;justify-content:space-between;gap:12px;font-size:13px;margin-bottom:5px"><span>${esc(p.q)}</span><b style="color:${p.score < 62 ? 'var(--red)' : 'var(--ink)'}">${p.score}%</b></div>${bar(p.score, p.score < 62 ? 'var(--red)' : '#6a4fa3')}</div>`).join('')}</div>
        <div class="card panel"><div class="panel-h"><h3>Insight</h3></div>${ring(avg, 'favourable', '#6a4fa3')}
          <p style="color:var(--ink-2);margin:14px 0 0">Tools and career outlook are the lowest-scoring areas, mostly among plant supervisors. Suggested next step: the <a href="#learning">Frontline Supervisor Academy</a> and the R&amp;D career lattice project.</p></div>
      </div>`;
  };

  // ----- Learning Academy -----
  V.learning = () => pillarHead('learning', null, 'Frontline supervisor academy, leadership, behavioural and functional capability, train-the-trainer.',
    `<button class="btn btn-primary btn-sm" id="addCohort">${icon('plus')} New cohort</button>`) +
    `<div class="grid g4">
      <div class="card tile"><small>Active learners</small><strong>${S.cohorts.reduce((a, c) => a + c.enrolled, 0)}</strong></div>
      <div class="card tile"><small>Avg completion</small><strong>${M.learning()}%</strong></div>
      <div class="card tile"><small>Learning hours (FY)</small><strong>9,840</strong></div>
      <div class="card tile"><small>Supervisor capability index</small><strong>3.4<span style="font-size:15px;color:var(--muted)">/5</span></strong><span class="delta up">▲ 0.5 post-academy</span></div>
    </div>
    <div class="grid g2 mt">${S.cohorts.map(c => `<div class="card panel">
      <div class="panel-h"><span class="chip gold">${esc(c.track)}</span><span class="sub">Starts ${fmtDate(c.start)} · ${esc(c.fee)}</span></div>
      <h3 style="font-size:17px;margin-bottom:12px">${esc(c.name)}</h3>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px"><span>Seats filled</span><b>${c.enrolled} / ${c.seats}</b></div>${bar(c.enrolled / c.seats * 100, '#b8862f')}
      <div style="display:flex;justify-content:space-between;font-size:13px;margin:12px 0 5px"><span>Completion</span><b>${c.completion}%</b></div>${bar(c.completion)}
      <div class="actions mt">${c.enrolled < c.seats ? `<button class="btn btn-ghost btn-sm" data-enrol="${c.id}">${icon('plus')} Nominate learner</button>` : '<span class="chip">Cohort full</span>'}</div>
    </div>`).join('')}</div>`;

  // ----- Rewards & Talent -----
  V.rewards = () => {
    const lo = 300000, hi = 3600000, pos = (v) => ((v - lo) / (hi - lo) * 100).toFixed(2);
    return pillarHead('rewards', null, 'Performance architecture, job evaluation, benchmarking, incentives, succession and careers.') +
      `<div class="grid g21"><div class="card panel"><div class="panel-h"><h3>Salary bands vs market</h3>
        <div class="legend"><span><i style="background:#f6ecd8;border:1px solid #b8862f"></i>Band</span><span><i style="background:#0f1b2d"></i>Market P50</span><span><i style="background:#1d8a68;border-radius:50%"></i>Employee</span></div></div>
        ${S.bands.map(b => {
          const emps = S.employees.filter(e => e.grade === b.grade);
          return `<div style="display:grid;grid-template-columns:42px 1fr 70px;gap:12px;align-items:center;margin:14px 0">
            <b>${b.grade}</b>
            <div style="position:relative;height:22px;background:var(--bg);border-radius:6px">
              <div style="position:absolute;left:${pos(b.min)}%;width:${pos(b.max) - pos(b.min)}%;top:3px;bottom:3px;background:var(--gold-soft);border:1px solid #d9b46a;border-radius:5px" title="${inr(b.min)} – ${inr(b.max)}"></div>
              <div style="position:absolute;left:${pos(b.market)}%;top:0;bottom:0;width:2px;background:var(--ink)" title="Market P50 ${inr(b.market)}"></div>
              ${emps.map(e => `<div style="position:absolute;left:calc(${pos(e.ctc)}% - 6px);top:5px;width:12px;height:12px;border-radius:50%;background:var(--brand-2);border:2px solid #fff;box-shadow:0 0 0 1px var(--brand)" title="${esc(e.name)} · ${inr(e.ctc)} · compa ${(e.ctc / b.mid).toFixed(2)}"></div>`).join('')}
            </div>
            <span style="font-size:12px;color:${b.mid < b.market * .97 ? 'var(--red)' : 'var(--muted)'}">${b.mid < b.market * .97 ? 'Below market' : 'At market'}</span></div>`;
        }).join('')}
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-left:54px;margin-right:82px"><span>₹3 L</span><span>₹12 L</span><span>₹24 L</span><span>₹36 L</span></div>
      </div>
      <div class="card panel"><div class="panel-h"><h3>Performance distribution</h3><span class="sub">FY26 calibrated</span></div>
        ${hbars([['Outstanding (4.5+)', 8, '8%'], ['Exceeds (4.0–4.4)', 24, '24%'], ['Meets (3.5–3.9)', 51, '51%'], ['Developing (<3.5)', 17, '17%']], '#b9771a')}
        <div class="note mt">${icon('sparkle')} S2 supervisor band midpoint sits 5% below market, a likely reason for supervisor attrition.</div></div></div>
      <div class="card panel mt"><div class="panel-h"><h3>Succession for critical roles</h3></div><div class="table-wrap"><table class="t">
        <thead><tr><th>Critical role</th><th>Incumbent</th><th>Successor</th><th>Readiness</th><th>Risk</th></tr></thead><tbody>
        ${S.succession.map(s => `<tr><td><b>${esc(s.role)}</b></td><td>${esc(s.incumbent)}</td><td>${esc(s.ready)}</td><td>${statusChip(s.readiness)}</td><td>${statusChip(s.risk)}</td></tr>`).join('')}
        </tbody></table></div></div>`;
  };

  // ----- HR Tech & Analytics -----
  V.tech = () => {
    const depts = {}; S.employees.forEach(e => depts[e.dept] = (depts[e.dept] || 0) + 1);
    return pillarHead('tech', null, 'HRIS support, workflow automation, dashboards, people analytics and employee listening.') +
      `<div class="grid g2">
        <div class="card panel"><div class="panel-h"><h3>Headcount</h3><span class="sub">+${S.headcountTrend.at(-1) - S.headcountTrend[0]} in 10 months</span></div>${lineChart(S.headcountTrend, S.months)}</div>
        <div class="card panel"><div class="panel-h"><h3>Monthly attrition</h3><span class="sub">Target ≤ 2%</span></div>${lineChart(S.attritionTrend, S.months, { color: '#b4412f', suffix: '%' })}</div>
      </div>
      <div class="grid g3 mt">
        <div class="card panel"><div class="panel-h"><h3>Payroll cost by site</h3><span class="sub">Monthly gross</span></div>${hbars([['Pune Plant', 148, '₹1.48 Cr'], ['Chakan Plant', 102, '₹1.02 Cr'], ['Mumbai HQ', 86, '₹0.86 Cr'], ['Bengaluru R&D', 48, '₹0.48 Cr']], '#2b5ea8')}</div>
        <div class="card panel"><div class="panel-h"><h3>Profiles by department</h3></div>${hbars(Object.entries(depts).sort((a, b) => b[1] - a[1]), '#1d8a68')}</div>
        <div class="card panel"><div class="panel-h"><h3>Workflow automation</h3><span class="sub">${S.automations.filter(a => a.on).length} on</span></div>
          ${S.automations.map((a, i) => `<div class="list-row"><div class="grow" style="font-size:13px">${esc(a.name)}</div><button class="toggle ${a.on ? 'on' : ''}" data-auto="${i}" aria-label="Toggle automation" aria-pressed="${a.on}"></button></div>`).join('')}</div>
      </div>
      <div class="card panel mt"><div class="panel-h"><h3>Integrations</h3><span class="sub">HRIS implementation support</span></div>
        <div class="grid g4">${[['Biometric attendance', 'Connected'], ['Tally / ERP finance', 'Connected'], ['EPFO & ESIC portals', 'Connected'], ['Job boards', 'Connected'], ['WhatsApp employee bot', 'Pilot'], ['Bank salary upload', 'Connected'], ['LMS (SCORM)', 'Connected'], ['SSO (Azure AD / Google)', 'Available']]
          .map(([n, s]) => `<div class="list-row" style="border:1px solid var(--line);border-radius:10px;padding:10px 12px"><div class="grow"><b style="font-size:13px">${n}</b></div><span class="chip ${s === 'Connected' ? 'green' : s === 'Pilot' ? 'gold' : ''}">${s}</span></div>`).join('')}</div></div>`;
  };

  // ----- Engagements & billing -----
  V.billing = () => {
    const rows = S.engagements.map(e => ({ ...e, total: e.rate * e.units, p: pillarOf(e.pillar) }));
    const sum = rows.reduce((a, r) => a + r.total, 0);
    return head('Commercials', 'Plan & invoice', 'The services this client has chosen, the fee model for each, and this month&#39;s amount.') + explainBox('billing') +
      `<div class="grid g21"><div class="card panel"><div class="panel-h"><h3>November 2026 · estimated invoice</h3><span class="sub">GST extra</span></div><div class="table-wrap"><table class="t">
        <thead><tr><th>Service · what is billed</th><th>Fee model</th><th class="num">Rate</th><th class="num">Units</th><th class="num">Amount</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td><b>${r.p.name}</b><br><span style="color:var(--muted);font-size:12px">${esc(r.service)}</span></td><td>${esc(r.model)}</td><td class="num">${inr(r.rate)}</td><td class="num">${r.units} ${r.unit}</td><td class="num"><b>${inr(r.total)}</b></td></tr>`).join('')}
        <tr><td colspan="4" style="text-align:right;font-weight:600">Total</td><td class="num"><b style="font-size:16px">${inr(sum)}</b></td></tr>
        </tbody></table></div></div>
        <div class="card panel"><div class="panel-h"><h3>Fee models explained</h3></div>
          ${rows.map(r => { const m = r.p.pricing.find(x => r.model.startsWith(x.model)) || r.p.pricing[0];
            return `<div class="list-row" style="align-items:flex-start"><span class="ic-sq" style="background:var(--surface-2)">${icon(r.p.icon)}</span><div class="grow"><b>${esc(r.model)}</b><span style="display:block">${m.how}</span></div></div>`; }).join('')}
          <a class="btn btn-ghost btn-sm" style="margin-top:12px" href="estimate.html">Estimate a different plan</a></div></div>`;
  };

  // ---------- router + events ----------
  function route() {
    let id = location.hash.slice(1) || 'overview';
    if (!V[id]) id = 'overview';
    renderNav(id);
    $('#view').innerHTML = V[id]();
    const lk = $('#lk'); if (lk) lk.innerHTML = icon('lock', 'icon');
    document.title = (ROUTES.find(r => r.id === id)?.name || 'Workspace') + ' · Nakshatra People';
    bind(id);
  }
  const rerender = () => { save(); route(); };

  function bind(id) {
    const v = $('#view');
    v.querySelectorAll('[data-tabs]').forEach(tb => tb.addEventListener('click', e => {
      const b = e.target.closest('[data-tab]'); if (!b) return; state[tb.dataset.tabs] = b.dataset.tab; route();
    }));
    v.querySelector('[data-goto]')?.addEventListener('click', () => { state.hrmsTab = 'payroll'; });
    const pq = $('#peopleQ');
    if (pq) pq.addEventListener('input', () => { state.q = pq.value; const pos = pq.selectionStart; route(); const n = $('#peopleQ'); n.focus(); n.setSelectionRange(pos, pos); });

    v.onclick = e => { // assigned (not added) so re-renders don't stack handlers
      const t = e.target.closest('button'); if (!t) return;
      const d = t.dataset;
      if (d.approve || d.reject) {
        const l = S.leaves.find(x => x.id === (d.approve || d.reject)); l.status = d.approve ? 'Approved' : 'Rejected';
        toast(`${l.emp}'s leave ${l.status.toLowerCase()}`); rerender();
      } else if (d.resolve) {
        S.tickets.find(x => x.id === d.resolve).status = 'Resolved'; toast(`${d.resolve} resolved`); rerender();
      } else if (d.advance) {
        const c = S.candidates.find(x => x.id === d.advance); c.stage = STAGES[STAGES.indexOf(c.stage) + 1];
        if (c.stage === 'Joined') { const r = S.requisitions.find(x => x.id === c.req); if (r && r.filled < r.openings) r.filled++; toast(`${c.name} joined · onboarding checklist created`); }
        else toast(`${c.name} moved to ${c.stage}`);
        rerender();
      } else if (d.file) {
        const k = S.compliance.find(x => x.id === d.file); k.status = 'Done'; toast(`${k.item} marked filed · evidence saved`); rerender();
      } else if (d.verify) {
        const c = S.contractors[+d.verify]; Object.assign(c, { pf: 'Verified', esi: 'Verified', wages: 'Verified', licence: 'Valid', risk: 'Low' });
        toast(`${c.vendor} verified for October`); rerender();
      } else if (d.auto) {
        const a = S.automations[+d.auto]; a.on = !a.on; toast(`Automation ${a.on ? 'enabled' : 'paused'}`); rerender();
      } else if (d.enrol) {
        const c = S.cohorts.find(x => x.id === d.enrol);
        modal(`<h3>Nominate to ${esc(c.name)}</h3><form><div class="field"><label>Employee</label><select name="emp">${S.employees.map(e => `<option>${esc(e.name)} — ${esc(e.role)}</option>`).join('')}</select></div>
          <div class="foot"><button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button><button class="btn btn-primary btn-sm">Nominate</button></div></form>`,
          fd => { c.enrolled++; toast(`${fd.get('emp').split(' — ')[0]} nominated`); rerender(); });
      } else if (d.enquire) {
        const p = pillarOf(d.enquire); toast(`Enquiry noted for ${p.name} (demo only)`);
      }
    };

    if (id === 'hrms') {
      $('#addEmp').onclick = () => modal(`<h3>Add employee</h3><form>
        <div class="field"><label>Full name</label><input name="name" required></div>
        <div class="field"><label>Role</label><input name="role" required></div>
        <div class="grid g2" style="gap:10px"><div class="field"><label>Department</label><select name="dept">${['Operations', 'R&D', 'Quality', 'Sales', 'Finance', 'People'].map(x => `<option>${x}</option>`).join('')}</select></div>
        <div class="field"><label>Site</label><select name="site">${S.org.sites.map(x => `<option>${x}</option>`).join('')}</select></div></div>
        <div class="grid g2" style="gap:10px"><div class="field"><label>Grade</label><select name="grade">${S.bands.map(b => `<option>${b.grade}</option>`).join('')}</select></div>
        <div class="field"><label>Annual CTC (₹)</label><input name="ctc" type="number" min="0" step="1000" required></div></div>
        <div class="foot"><button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button><button class="btn btn-primary btn-sm">Add &amp; start onboarding</button></div></form>`,
        fd => {
          const name = fd.get('name').trim(); if (!name) return false;
          const n = 1001 + S.employees.length;
          S.employees.unshift({ id: 'E' + n, name, role: fd.get('role').trim(), dept: fd.get('dept'), site: fd.get('site'), grade: fd.get('grade'), ctc: +fd.get('ctc'), joined: '2026-11-06', status: 'Probation', perf: 0 });
          state.hrmsTab = 'people'; state.q = ''; toast(`${name} added · onboarding started`); rerender();
        });
      const pn = $('#payNext');
      if (pn) pn.onclick = () => {
        const flow = ['Draft', 'Validated', 'Approved', 'Disbursed'];
        S.payroll.status = flow[flow.indexOf(S.payroll.status) + 1];
        if (S.payroll.status === 'Validated') S.payroll.exceptions = 0;
        toast({ Validated: 'Validation passed · 3 exceptions fixed', Approved: 'Approved by CFO', Disbursed: 'Salaries disbursed · payslips sent' }[S.payroll.status]);
        rerender();
      };
      const pr = $('#payReg'); if (pr) pr.onclick = () => toast('Register export is disabled in the demo');
    }
    if (id === 'talent') {
      $('#addReq').onclick = () => modal(`<h3>New requisition</h3><form>
        <div class="field"><label>Role title</label><input name="title" required></div>
        <div class="grid g2" style="gap:10px"><div class="field"><label>Hiring type</label><select name="type"><option>Permanent</option><option>Volume</option><option>Leadership search</option><option>RPO</option></select></div>
        <div class="field"><label>Site</label><select name="site">${S.org.sites.map(x => `<option>${x}</option>`).join('')}</select></div></div>
        <div class="grid g2" style="gap:10px"><div class="field"><label>Openings</label><input name="openings" type="number" min="1" value="1" required></div>
        <div class="field"><label>Budget CTC (₹)</label><input name="budget" type="number" min="0" step="1000" required></div></div>
        <div class="foot"><button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button><button class="btn btn-primary btn-sm">Raise requisition</button></div></form>`,
        fd => {
          const title = fd.get('title').trim(); if (!title) return false;
          S.requisitions.unshift({ id: 'R-' + (301 + S.requisitions.length), title, site: fd.get('site'), type: fd.get('type'), openings: Math.max(1, +fd.get('openings')), filled: 0, ageDays: 0, budget: +fd.get('budget') });
          toast(`${title} requisition raised`); rerender();
        });
    }
    if (id === 'compliance') $('#auditPack').onclick = () => toast(`Audit pack compiled: ${S.compliance.filter(k => k.status === 'Done').length} filings, ${S.contractors.length} vendor files`);
    if (id === 'od') $('#launchPulse').onclick = () => toast('Pulse survey scheduled for 612 employees (demo)');
    if (id === 'learning') $('#addCohort').onclick = () => modal(`<h3>New cohort</h3><form>
      <div class="field"><label>Programme name</label><input name="name" required></div>
      <div class="grid g2" style="gap:10px"><div class="field"><label>Track</label><select name="track"><option>Supervisor</option><option>Leadership</option><option>Behavioural</option><option>Functional</option><option>Train-the-trainer</option></select></div>
      <div class="field"><label>Seats</label><input name="seats" type="number" min="1" value="20" required></div></div>
      <div class="field"><label>Start date</label><input name="start" type="date" value="2026-12-01" required></div>
      <div class="field"><label>Commercial model</label><select name="fee"><option>Per participant</option><option>Cohort fee</option><option>Annual contract</option></select></div>
      <div class="foot"><button type="button" class="btn btn-ghost btn-sm" data-close>Cancel</button><button class="btn btn-primary btn-sm">Create cohort</button></div></form>`,
      fd => {
        const name = fd.get('name').trim(); if (!name) return false;
        S.cohorts.push({ id: 'P' + (S.cohorts.length + 1), name, track: fd.get('track'), seats: Math.max(1, +fd.get('seats')), enrolled: 0, completion: 0, start: fd.get('start'), fee: fd.get('fee') });
        toast(`${name} created`); rerender();
      });
  }

  addEventListener('hashchange', () => { $('#side').classList.remove('open'); scrollTo(0, 0); route(); });
  route();
})();
