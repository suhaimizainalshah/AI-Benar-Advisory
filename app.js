/* Compliscope Advisory site script. No cookies, no third-party trackers.
   1. Mobile menu  2. Timeline "next deadline"  3. The AI rules check  4. Anonymous counts */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- settings you can change ---------- */
  const ANALYTICS = {
    on: true,
    namespace: "compliscope-advisory",   // change to a name only you use
    showVisitsFrom: 1000,                // the public visitor count appears only from this number
  };

  /* ---------- 1. menu and small things ---------- */
  const menu = $(".menu"), list = $("#nav-list");
  menu?.addEventListener("click", () => { const open = list.classList.toggle("open"); menu.setAttribute("aria-expanded", open); });
  list?.addEventListener("click", e => { if (e.target.closest("a") && list.classList.contains("open")) { list.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); } });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- 2. timeline: mark past dates and the next one ---------- */
  const today = new Date();
  let marked = false;
  $$(".timeline li").forEach(li => {
    const d = new Date(li.querySelector("time").getAttribute("datetime"));
    li.classList.toggle("past", d <= today);
    if (!marked && d > today) { li.classList.add("next"); li.querySelector("time").insertAdjacentHTML("afterend", '<span class="tl-next">Next deadline</span>'); marked = true; }
  });

  /* ---------- 3. the AI rules check ---------- */
  // Each rule: when it applies, a short title, what it means, and a status tag.
  const RULES = [
    { when: a => a.where.EU && a.use.chat, tag: "Applies now", title: "EU AI Act Article 50(1): tell people they’re talking to AI", note: "In force since 2 August 2026 for chatbots and AI assistants." },
    { when: a => a.where.EU && a.use.content, tag: "Applies now", title: "EU AI Act Article 50: label AI-generated content", note: "Deepfakes and AI text on matters of public interest must be disclosed; AI providers must mark content in a machine-readable way, with legacy systems due by 2 December 2026." },
    { when: a => a.where.EU && (a.use.screen || a.use.decide || (a.sector === "education" && a.use.decide)), tag: "From Dec 2027", soon: true, title: "EU AI Act high-risk duties (Annex III)", note: "AI in hiring, education, credit and essential services needs human oversight, logs and information for affected people from 2 December 2027." },
    { when: a => (a.where.EU || a.where.UK) && (a.use.screen || a.use.decide), tag: "Applies now", title: a => `${a.where.EU && a.where.UK ? "EU and UK GDPR" : a.where.UK ? "UK GDPR" : "EU GDPR"} Article 22: automated decisions`, note: "People have rights when significant decisions about them are made by automated means." },
    { when: a => a.where.EU && a.any, tag: "Applies now", title: "EU AI Act Article 4: AI literacy", note: "Staff who use or oversee AI need a suitable level of AI literacy." },
    { when: a => (a.where.EU || a.where.UK) && a.any, tag: "Applies now", title: a => a.where.EU && a.where.UK ? "EU and UK GDPR: personal data in AI" : a.where.UK ? "UK GDPR: personal data in AI" : "EU GDPR: personal data in AI", note: "A lawful basis, clear notices and a data protection impact assessment where the risk is high." },
    { when: a => a.where.VN && a.any, tag: "Applies now", title: "Vietnam Law on Artificial Intelligence (Law 134/2025)", note: a => `In force since 1 March 2026. Systems already running before then must comply by ${["health", "education", "finance"].includes(a.sector) ? "September 2027 in your sector" : "March 2027"}.` },
    { when: a => a.where.VN && (a.use.content || a.use.chat), tag: "Applies now", title: "Vietnam: transparency and labelling of AI content", note: "People must know when they deal with AI, and AI-generated content and deepfakes must be identifiable." },
    { when: a => a.where.VN && a.any, tag: "Applies now", title: "Vietnam Personal Data Protection Law (Law 91/2025)", note: "In force since 1 January 2026: consent, impact assessments and rules on transfers abroad." },
    { when: a => a.where.KR && (a.use.chat || a.use.content), tag: "Applies now", title: "South Korea AI Basic Act: generative AI notices and labels", note: "Tell users when a service uses generative AI, and label realistic AI content. Fines are expected from January 2027." },
    { when: a => a.where.KR && (a.use.screen || a.use.decide), tag: "Applies now", title: "South Korea AI Basic Act: possible high-impact AI", note: "AI in hiring, lending and other significant decisions may count as high-impact, with risk management and explanation duties." },
    { when: a => a.where.KR && a.any, tag: "Check", soon: true, title: "South Korea: domestic representative", note: "Foreign AI businesses above user or revenue thresholds must appoint a representative in Korea." },
    { when: a => a.where.ASEAN && a.any, tag: "Voluntary", voluntary: true, title: "Singapore and ASEAN AI governance frameworks", note: "Voluntary today, but widely used as the benchmark. Malaysia, Indonesia and Thailand are drafting binding AI rules." },
    { when: a => a.where.ASEAN && a.any, tag: "Applies now", title: "Singapore PDPA and Malaysia PDPA", note: "Binding data protection duties, including a DPO in Singapore and 72-hour breach reporting in Malaysia where thresholds are met." },
  ];
  const form = $("#check"), result = $("#result"), err = $(".check-error");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form), where = fd.getAll("where"), uses = fd.getAll("use");
    if (!where.length || !uses.length) { err.hidden = false; result.hidden = true; return; }
    err.hidden = true;
    const a = { where: Object.fromEntries(where.map(w => [w, true])), use: Object.fromEntries(uses.map(u => [u, true])), sector: fd.get("sector") || "other", any: true };
    const hits = RULES.filter(r => r.when(a));
    const val = (v) => (typeof v === "function" ? v(a) : v);
    const strict = hits.filter(h => h.tag === "Applies now").length;
    result.innerHTML = `
      <h3>${strict ? `${strict} binding rule${strict > 1 ? "s" : ""} probably apply to you` : "Mostly good practice for now"}</h3>
      <p class="next">${hits.length > 4 ? "That’s a lot to track at once. A readiness assessment puts them in order." : "A website check is a quick way to see where you stand."}</p>
      <ul class="rules">${hits.map(h => `<li><span class="tag${h.soon ? " soon" : ""}${h.voluntary ? " voluntary" : ""}">${h.tag}</span><b>${val(h.title)}</b><small>${val(h.note)}</small></li>`).join("")}</ul>
      <a class="btn block" href="#contact" data-track="check_contact">Talk through my results</a>
      <p class="fine" style="margin-top:.7rem">A first indication based on your answers, not legal advice.</p>`;
    result.hidden = false; result.focus({ preventScroll: true }); result.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    count("check_done");
  });

  /* ---------- 4. anonymous counts (no cookies, no personal data) ---------- */
  const canCount = ANALYTICS.on && /^https?:$/.test(location.protocol) && !navigator.globalPrivacyControl && navigator.doNotTrack !== "1" && location.hostname !== "localhost";
  const API = `https://abacus.jasoncameron.dev`;
  function count(key) { if (!canCount) return; try { fetch(`${API}/hit/${ANALYTICS.namespace}/${key}`, { keepalive: true, mode: "cors" }).catch(() => {}); } catch {} }
  async function get(key) { try { const r = await fetch(`${API}/get/${ANALYTICS.namespace}/${key}`); return r.ok ? (await r.json()).value : 0; } catch { return null; } }
  try { if (location.hash !== "#stats" && !sessionStorage.getItem("ca-visit")) { sessionStorage.setItem("ca-visit", "1"); count("visits"); } } catch {}
  document.addEventListener("click", e => { const t = e.target.closest("[data-track]"); if (t) count(t.dataset.track); });

  // Public visitor count only once it is worth showing.
  (async () => {
    if (!/^https?:$/.test(location.protocol)) return;
    const v = await get("visits");
    if (v && v >= ANALYTICS.showVisitsFrom) { const li = $(".proof .visits"); li.querySelector("[data-visits]").textContent = v.toLocaleString("en-GB"); li.hidden = false; }
  })();

  // Private stats: add #stats to the address.
  const LABELS = { visits: "Visits", check_done: "Checks completed", hero_contact: "Hero: book a call", nav_contact: "Menu: book a call", check_contact: "After check: talk it through", book_call: "Choose a time", email: "Email clicks", tool_compliscope: "Compliscope link", tool_sloptical: "Sloptical link" };
  async function showStats() {
    const box = $("#stats"), dl = $("#stats-list"); box.hidden = false; dl.innerHTML = "<dt>Loading…</dt><dd></dd>";
    const rows = await Promise.all(Object.entries(LABELS).map(async ([k, l]) => [l, await get(k)]));
    dl.innerHTML = rows.map(([l, v]) => `<dt>${l}</dt><dd>${v == null ? "–" : v.toLocaleString("en-GB")}</dd>`).join("");
    $("#stats-close").focus();
  }
  const closeStats = () => { $("#stats").hidden = true; history.replaceState(null, "", location.pathname); };
  $("#stats-close")?.addEventListener("click", closeStats);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#stats").hidden) closeStats(); });
  addEventListener("hashchange", () => location.hash === "#stats" && showStats());
  if (location.hash === "#stats") showStats();
})();
