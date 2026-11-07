// =====================================================================
// SERVICE CATALOGUE — the single source of truth for what we offer.
// Every page (home, service pages, estimator, client portal) reads this.
// Prices are ILLUSTRATIVE placeholders — edit them here to match your rate card.
// =====================================================================
window.FIRM = {
  name: 'Nakshatra People',
  promise: 'We run, fix and grow your people function, and our software lets you see every step.',
  outcomes: [
    { icon: 'shield', t: 'Compliance', d: 'Every filing, register and licence handled on time, with evidence ready for any inspection.' },
    { icon: 'clock', t: 'Productivity', d: 'Your managers stop chasing payroll, hiring and paperwork, and get back to running the business.' },
    { icon: 'heart', t: 'Employee experience', d: 'Correct pay, quick answers to queries, fair growth, and a voice that leadership actually hears.' },
    { icon: 'chart', t: 'Business performance', d: 'The right people, in the right roles, with the right skills, and the data to prove it.' },
  ],
  process: [
    { t: 'Diagnose', d: 'A free 30-minute call, then a short review of your HR, payroll, compliance and hiring. You get a written gap report.' },
    { t: 'Propose', d: 'We recommend only the services you need, with scope, timelines and the fee model that fits you best.' },
    { t: 'Onboard', d: 'We take over the data and processes, set up your client portal and introduce your dedicated team.' },
    { t: 'Deliver & report', d: 'Our team does the work every month. You see the progress, approvals and results live in the portal.' },
  ],
};

window.PILLARS = [
  {
    id: 'hrms', icon: 'users', color: 'green', name: 'HR Managed Services',
    short: 'We run your day-to-day HR and payroll for you, accurately and on time every month.',
    problem: 'Payroll errors, missed attendance data, slow answers to employee questions and messy employee records cost money and trust. Small HR teams spend most of their time on processing instead of people.',
    forWho: ['Companies with 50–5,000 employees', 'Multi-site businesses (plants, branches, stores)', 'Firms without a full in-house HR operations team'],
    lines: [
      { name: 'HR operations', what: 'We handle the routine HR work: letters, records, confirmations, transfers and HR documentation.', get: 'Accurate employee records and documents issued within agreed timelines' },
      { name: 'Payroll administration', what: 'We process monthly salary: attendance inputs, overtime, deductions, PF, ESI, PT, TDS, bank file and payslips.', get: 'Payslips on time, statutory challans paid, a monthly payroll register' },
      { name: 'Employee lifecycle', what: 'We manage every stage from joining paperwork and induction to confirmation, transfers, exit and full-and-final settlement.', get: 'Smooth joining and exits, FnF settled within policy days' },
      { name: 'HR helpdesk', what: 'Employees raise questions on pay, leave, tax or benefits, and our team answers within an agreed SLA.', get: 'A ticket system with response-time reports' },
      { name: 'Attendance & leave', what: 'We integrate biometric or mobile attendance, apply your leave policy and reconcile before payroll.', get: 'Clean attendance data and leave balances every month' },
      { name: 'HRIS administration', what: 'We keep your HR system set up, updated and correct: masters, policies, access and reports.', get: 'One reliable source of employee data' },
    ],
    steps: [
      { t: 'Take-over', d: 'We collect past payroll, policies and employee data, then run one parallel payroll to check every number.' },
      { t: 'Monthly cycle', d: 'Attendance cut-off, then inputs, processing, your approval, disbursement and payslips.' },
      { t: 'Daily support', d: 'The helpdesk answers employee queries; lifecycle events are processed as they happen.' },
      { t: 'Monthly review', d: 'We share accuracy, timeliness and query-closure numbers with you.' },
    ],
    pricing: [
      { model: 'Monthly per-employee fee', how: 'A fixed fee for each employee on payroll, each month. Scales up or down with your headcount.', example: '300 employees × ₹450 = ₹1,35,000 per month' },
      { model: 'Retainer', how: 'A flat monthly fee for an agreed scope and headcount band. Predictable for budgeting.', example: '₹1,50,000 per month for up to 350 employees' },
      { model: 'Transaction fee', how: 'Pay only per activity, such as each joiner, exit or FnF processed. Good for low-volume needs.', example: '₹2,000 per joining or exit processed' },
    ],
    kpis: ['Payroll accuracy ≥ 99.8%', 'Payslips released on salary day', 'Queries answered within 24 hours', 'FnF settled within 30 days'],
    portal: ['Approve each month\'s payroll before it is paid', 'Approve leave and see attendance', 'Track helpdesk tickets and SLAs', 'View the employee directory'],
  },
  {
    id: 'talent', icon: 'briefcase', color: 'blue', name: 'Workforce & Talent',
    short: 'We find, hire and onboard the people you need, from shop-floor teams to senior leaders.',
    problem: 'Positions stay open too long, volume hiring for plants overwhelms local HR, wrong hires leave within months, and nobody has a clear plan for how many people the business will need next year.',
    forWho: ['Companies scaling plants, branches or teams', 'Businesses hiring 20+ people at once', 'Boards looking for CXO and senior leaders'],
    lines: [
      { name: 'Permanent recruitment', what: 'We source, screen and shortlist candidates for individual roles, then coordinate interviews up to the offer.', get: 'A shortlist of 3–5 assessed candidates per role' },
      { name: 'Volume hiring', what: 'Walk-in drives, campus and ITI tie-ups, and bulk screening for operators, technicians and frontline roles.', get: 'Large batches hired to an agreed timeline' },
      { name: 'Leadership search', what: 'Confidential, research-led search for senior and CXO roles, with deep referencing.', get: 'A mapped market and an assessed leadership shortlist' },
      { name: 'RPO', what: 'Recruitment Process Outsourcing: our recruiters act as your in-house hiring team, using your brand and process.', get: 'A dedicated recruiting team with monthly hiring reports' },
      { name: 'Workforce planning', what: 'We work out how many people, with which skills, you need over the next 12–24 months and what it will cost.', get: 'A headcount and cost plan by department and site' },
      { name: 'Onboarding', what: 'Pre-joining engagement, documentation, induction and 30/60/90-day check-ins so new hires stay.', get: 'Fewer offer drop-outs and better early retention' },
    ],
    steps: [
      { t: 'Brief', d: 'We agree the role, profile, salary range and timeline with the hiring manager.' },
      { t: 'Source & screen', d: 'We search, assess and shortlist, and you see every candidate in the portal.' },
      { t: 'Interview & offer', d: 'We schedule interviews, collect feedback and negotiate the offer.' },
      { t: 'Join & retain', d: 'Onboarding and check-ins until the end of the replacement guarantee.' },
    ],
    pricing: [
      { model: 'Placement fee', how: 'A percentage of the hired person\'s annual CTC, paid only when they join. Includes a replacement guarantee.', example: '8.33% of ₹12 L CTC = ₹1,00,000 per hire' },
      { model: 'Per-hire fee', how: 'A flat fee per person hired. Used for volume roles where salaries are similar.', example: '40 operators × ₹10,000 = ₹4,00,000' },
      { model: 'Monthly RPO', how: 'A monthly fee for a dedicated recruiting team that handles all your hiring.', example: '₹2,75,000 per month for a 3-recruiter team' },
    ],
    kpis: ['Time-to-fill', 'Offer-to-join ratio', '90-day retention of new hires', 'Cost per hire'],
    portal: ['See every open position and its progress', 'Review candidates at each stage', 'Raise a new hiring request', 'View the workforce plan'],
  },
  {
    id: 'compliance', icon: 'shield', color: 'red', name: 'Compliance & Risk',
    short: 'We keep you compliant with Indian labour laws across every site and contractor, and audit-ready.',
    problem: 'India has dozens of central and state labour laws, the new Labour Codes, and frequent inspections. Missed filings, outdated registers and non-compliant contractors lead to penalties, prosecution risk and reputational damage.',
    forWho: ['Factories and multi-state operations', 'Businesses using contract labour', 'Companies preparing for audits, investors or IPOs'],
    lines: [
      { name: 'Compliance diagnostics', what: 'A site-by-site check of registrations, registers, returns, licences and policies against applicable laws.', get: 'A risk-rated gap report with a fix-it plan' },
      { name: 'Compliance calendar', what: 'Every due date for PF, ESI, PT, LWF, TDS, returns and licence renewals, with an owner and reminders.', get: 'No missed deadlines, with proof of every filing' },
      { name: 'Audit readiness', what: 'We keep registers, challans and records up to date and run mock inspections.', get: 'An inspection-ready file for each site' },
      { name: 'Contractor governance', what: 'Monthly checks that contractors pay PF, ESI and minimum wages, and hold valid CLRA licences.', get: 'Protection from principal-employer liability' },
      { name: 'Policy review', what: 'We review and update your HR policies and standing orders for current law and the Labour Codes.', get: 'A legally current policy manual' },
      { name: 'POSH framework support', what: 'Setting up the Internal Committee, policy, awareness training, external member and the annual report.', get: 'A complete POSH Act 2013 setup and annual compliance' },
    ],
    steps: [
      { t: 'Diagnose', d: 'We visit or remotely review each site and rate every gap as high, medium or low risk.' },
      { t: 'Fix', d: 'We close the gaps: registrations, registers, policies and contractor documents.' },
      { t: 'Run', d: 'We run the monthly calendar, file returns and check contractors.' },
      { t: 'Prove', d: 'We store evidence for every item and give you an audit-readiness score.' },
    ],
    pricing: [
      { model: 'Retainer', how: 'A flat monthly fee for running compliance across your organisation.', example: '₹40,000 per month' },
      { model: 'Site / month fee', how: 'A monthly fee for each location we manage, so cost grows with your footprint.', example: '4 sites × ₹12,000 = ₹48,000 per month' },
      { model: 'Project fee', how: 'A one-time fee for a defined piece of work, such as a diagnostic, a policy overhaul or a POSH setup.', example: 'Compliance diagnostic: ₹1,50,000 one-time' },
    ],
    kpis: ['Zero missed statutory deadlines', 'Audit-readiness score per site', 'Contractor compliance %', 'Penalties avoided'],
    portal: ['A calendar of every filing with its status', 'An audit-readiness score', 'A contractor compliance checklist', 'A POSH committee and training record'],
  },
  {
    id: 'od', icon: 'network', color: 'violet', name: 'OD & Transformation',
    short: 'We redesign how your organisation is structured and works, so your strategy actually happens.',
    problem: 'As companies grow, roles overlap, decisions slow down, culture drifts and change programmes stall. The structure that worked at 100 people breaks at 1,000.',
    forWho: ['Promoter-led firms professionalising', 'Companies after mergers, restructuring or rapid growth', 'Leaders whose strategy is not being executed'],
    lines: [
      { name: 'Organisation design', what: 'We design the structure: reporting lines, spans of control, layers and team set-up.', get: 'A new organisation chart with the reasoning behind it' },
      { name: 'Role clarity', what: 'Clear job descriptions, KRAs and decision rights (who decides, who is consulted) for each key role.', get: 'Role charters and a decision-rights matrix' },
      { name: 'Operating model', what: 'How work flows between functions, sites and HQ, and which governance forums and meetings it needs.', get: 'An operating model blueprint' },
      { name: 'Culture & engagement', what: 'We measure engagement through surveys and focus groups and define the culture you need.', get: 'An engagement report and a culture action plan' },
      { name: 'Change management', what: 'Communication, leader alignment and adoption support so a change sticks.', get: 'A change plan and adoption tracking' },
      { name: 'Process redesign', what: 'We map and simplify people processes and handovers, removing delay and duplication.', get: 'Redesigned processes with time saved measured' },
    ],
    steps: [
      { t: 'Diagnose', d: 'Interviews, data and surveys to find what is really slowing the organisation.' },
      { t: 'Design', d: 'Options for structure, roles and processes, tested with leadership.' },
      { t: 'Pilot', d: 'We try the design in one unit and refine it.' },
      { t: 'Embed', d: 'We roll it out with change support and measure adoption.' },
    ],
    pricing: [
      { model: 'Project fee', how: 'A fixed fee for a defined transformation project with clear deliverables and milestones.', example: 'Organisation design for one business unit: ₹8,00,000' },
      { model: 'OD retainer', how: 'A monthly fee for an ongoing OD partner who supports leadership through continuous change.', example: '₹2,00,000 per month' },
    ],
    kpis: ['Decision speed', 'Role-overlap issues removed', 'Engagement score movement', 'Change adoption rate'],
    portal: ['Project progress by phase', 'Pulse survey results', 'Insights and recommended actions'],
  },
  {
    id: 'learning', icon: 'book', color: 'gold', name: 'Learning Academy',
    short: 'We build your people\'s skills through structured programmes, from frontline supervisors to senior leaders.',
    problem: 'Good technicians are promoted to supervisors with no people-management training. Managers learn on the job, skill gaps hurt quality and safety, and one-off workshops change nothing.',
    forWho: ['Manufacturing and service operations', 'Companies promoting from within', 'Organisations building a leadership pipeline'],
    lines: [
      { name: 'Frontline supervisor academy', what: 'A multi-month programme for shop-floor supervisors covering people handling, productivity, safety and communication, in local languages.', get: 'Certified supervisors and measured behaviour change' },
      { name: 'Leadership programmes', what: 'Development journeys for first-time, middle and senior managers, with coaching and real business projects.', get: 'A stronger leadership bench' },
      { name: 'Behavioural capability', what: 'Communication, teamwork, customer orientation, ownership and other soft skills.', get: 'Skills assessed before and after' },
      { name: 'Functional capability', what: 'Job skills such as lean, 5S, quality, sales and finance for non-finance managers.', get: 'Role-specific skill uplift' },
      { name: 'Train-the-trainer', what: 'We certify your internal experts to deliver training themselves.', get: 'An in-house faculty that scales learning at lower cost' },
    ],
    steps: [
      { t: 'Assess', d: 'A skill-gap assessment of participants and their managers.' },
      { t: 'Design', d: 'A programme built around your context, roles and language.' },
      { t: 'Deliver', d: 'Classroom, on-the-floor and digital sessions run in cohorts.' },
      { t: 'Measure', d: 'Assessments before and after, manager feedback and business impact.' },
    ],
    pricing: [
      { model: 'Per participant', how: 'A fee for each person who attends. Easy to scale with batch size.', example: '25 supervisors × ₹15,000 = ₹3,75,000' },
      { model: 'Cohort fee', how: 'A fixed fee per batch, up to an agreed size.', example: '₹3,00,000 per cohort of up to 25' },
      { model: 'Annual contract', how: 'A yearly agreement covering a calendar of programmes at a committed price.', example: '₹18,00,000 per year for 6 cohorts' },
    ],
    kpis: ['Completion rate', 'Skill improvement after training', 'Internal promotions filled', 'Supervisor-led attrition'],
    portal: ['Every programme and cohort in one place', 'Seats, attendance and completion', 'Nominate employees to programmes'],
  },
  {
    id: 'rewards', icon: 'award', color: 'amber', name: 'Rewards & Talent',
    short: 'We design fair, competitive pay and performance systems, and make sure key roles have successors.',
    problem: 'Pay decisions are ad hoc, salary bands are missing or outdated, performance reviews feel unfair, good people leave for small raises elsewhere, and critical roles have no backup.',
    forWho: ['Companies without structured grades and pay bands', 'Firms facing pay-related attrition', 'Leaders planning for continuity'],
    lines: [
      { name: 'Performance architecture', what: 'Goal setting, KRAs, review cycles, rating scales and calibration that managers can actually run.', get: 'A complete performance management system' },
      { name: 'Job evaluation', what: 'We assess the relative size of every role and build a grading structure.', get: 'A clear grade structure for all roles' },
      { name: 'Salary benchmarking', what: 'We compare your pay with the market by role, level and location.', get: 'Market-linked salary bands' },
      { name: 'Incentive design', what: 'Sales incentives, production bonuses and variable pay linked to results.', get: 'Incentive plans with cost modelling' },
      { name: 'Succession planning', what: 'We identify critical roles, assess internal successors and plan their development.', get: 'A succession chart with readiness levels' },
      { name: 'Career frameworks', what: 'Career paths, including technical tracks, so people can see how to grow.', get: 'A published career lattice' },
    ],
    steps: [
      { t: 'Analyse', d: 'We review current pay, grades, ratings and attrition data.' },
      { t: 'Benchmark', d: 'We compare against the market and evaluate the roles.' },
      { t: 'Design', d: 'We build the bands, performance system, incentives and careers.' },
      { t: 'Implement', d: 'We train managers, communicate to employees and support the first cycle.' },
    ],
    pricing: [
      { model: 'Consulting project', how: 'A fixed fee for a defined design project, such as a grading and pay-band study.', example: 'Job evaluation + salary bands: ₹8,00,000' },
      { model: 'Retainer', how: 'A monthly fee for ongoing reward advice, annual benchmarking and running review cycles.', example: '₹1,50,000 per month' },
    ],
    kpis: ['% of employees within pay band', 'Pay-related attrition', 'Ratings seen as fair (survey)', 'Critical roles with a ready successor'],
    portal: ['Salary bands compared with the market', 'Performance rating distribution', 'Succession for critical roles'],
  },
  {
    id: 'tech', icon: 'chart', color: 'blue', name: 'HR Technology & Analytics',
    short: 'We set up the right HR systems and turn your people data into dashboards leaders use.',
    problem: 'HR data lives in Excel sheets and disconnected tools, so leaders cannot get a straight answer to "how many people, at what cost, and why are they leaving?". HR software is bought but poorly implemented.',
    forWho: ['Companies choosing or implementing an HRMS', 'Leaders who want people dashboards', 'HR teams buried in manual work'],
    lines: [
      { name: 'HRIS implementation support', what: 'We help you choose an HR system, configure it, migrate data and train users.', get: 'An HR system that is live and actually used' },
      { name: 'Workflow automation', what: 'We automate approvals, reminders, onboarding and other repetitive HR tasks.', get: 'Hours of manual work removed every month' },
      { name: 'Dashboards', what: 'Live dashboards on headcount, cost, attrition, hiring and compliance.', get: 'A leadership people dashboard' },
      { name: 'People analytics', what: 'Deeper analysis: why people leave, what drives performance, where cost leaks.', get: 'Insight reports with recommended actions' },
      { name: 'Employee listening', what: 'Pulse surveys, eNPS and feedback channels, including WhatsApp for frontline staff.', get: 'A regular read on how employees feel' },
    ],
    steps: [
      { t: 'Assess', d: 'We map your current tools, data quality and reporting needs.' },
      { t: 'Implement', d: 'We configure the system, migrate data, connect integrations and set up automations.' },
      { t: 'Go live', d: 'We train users and run in parallel, then switch over.' },
      { t: 'Support', d: 'Ongoing support, new dashboards and analytics every month.' },
    ],
    pricing: [
      { model: 'Implementation fee', how: 'A one-time fee to set up the system, migrate data and train users.', example: '₹5,00,000 one-time' },
      { model: 'Recurring support', how: 'A monthly fee for support, changes, dashboards and analytics.', example: '₹45,000 per month' },
    ],
    kpis: ['System adoption %', 'Manual hours saved', 'Report turnaround time', 'Data accuracy'],
    portal: ['Headcount and attrition trends', 'Cost dashboards', 'Automations you can switch on or off', 'Connected systems'],
  },
];

// ---- Estimator: illustrative rates used by estimate.html ----
window.RATES = {
  hrms: { essentials: 300, complete: 450, retainerMin: 150000, retainerPerEmp: 380, perTransaction: 2000 }, // ₹ per employee / month etc.
  talent: { placementPct: 0.0833, perHire: 10000, rpoMonthly: 275000 },
  compliance: { perSite: 12000, retainer: 40000, diagnostic: 150000 },
  od: { focused: 600000, enterprise: 1800000, retainer: 200000 },
  learning: { perParticipant: 15000, cohort: 300000, annual: 1800000 },
  rewards: { project: 800000, retainer: 150000 },
  tech: { implementation: 500000, support: 45000 },
};
