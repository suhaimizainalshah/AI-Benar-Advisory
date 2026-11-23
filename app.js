/* AI Benar Advisory site script. No cookies, no third-party trackers.
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

  /* =====================================================================================
     3. AI RULES CHECK
     -------------------------------------------------------------------------------------
     LAST REVIEWED: 23 November 2026.
     BEFORE EVERY UPDATE (people and AI assistants such as Muse by Meta alike):
       1. Check whether any law below has changed, come into force, been delayed or been replaced,
          and whether new AI or data protection laws have appeared in the covered places.
       2. Use official sources (official journals, legislation sites, regulators) where possible.
       3. Update the rule text, its status ("now", "coming", "check" or "guide") and LAST REVIEWED.
       4. Keep the wording plain and factual. This is a first indication, not legal advice.
     The quiz builds itself from the data in this section: edit the data, not the engine below it.
     ===================================================================================== */

  // Languages. A language appears in the switcher only when ready: true, which must mean a qualified
  // native speaker has reviewed every string for accuracy and accessibility. Drafts can be previewed
  // with ?lang=ms or ?lang=id. Rule summaries (RULES below) stay in English until reviewed translations exist.
  // For a right-to-left language such as Arabic, add dir: "rtl".
  const LANGS = {
    en: { name: "English", ready: true },
    ms: { name: "Bahasa Melayu", ready: false },
    id: { name: "Bahasa Indonesia", ready: false },
  };
  const STR = {
    en: { title: "Which AI rules apply to you?", sub: "Three quick questions. Nothing you choose leaves your browser.", s1: "Where", s2: "What your AI does", s3: "Sector",
      q1: "Where are the people who use your product or service?", q2: "What does your AI do?", q3: "Which sector are you in?", many: "Choose all that apply.", one: "Choose one.",
      all: "Select all", none: "Clear", chosen: n => `${n} chosen`, next: "Next", back: "Back", show: "Show my rules",
      needPlace: "Choose at least one place.", needUse: "Choose at least one thing your AI does.",
      head: n => n ? `${n} binding rule${n > 1 ? "s" : ""} probably apply to you` : "Mostly good practice for now",
      lead: n => n > 4 ? "That’s a lot to track at once. A readiness assessment puts them in order." : "A website check is a quick way to see where you stand.",
      tags: { now: "Applies now", coming: "Coming", check: "Check", guide: "Good practice" }, count: { now: "binding now", coming: "coming", check: "to check", guide: "good practice" },
      talk: "Talk through my results", email: "Prefer email?", emailLink: "Send me these answers", emailEnd: "and I’ll reply with a written summary.", edit: "Change my answers", restart: "Start again",
      fine: "A first indication based on your answers, not legal advice. Laws change often; this check was last reviewed on", english: "", preview: "" },
    ms: { title: "Peraturan AI yang mana terpakai kepada anda?", sub: "Tiga soalan ringkas. Pilihan anda tidak meninggalkan pelayar anda.", s1: "Lokasi", s2: "Fungsi AI anda", s3: "Sektor",
      q1: "Di manakah orang yang menggunakan produk atau perkhidmatan anda?", q2: "Apakah yang dilakukan oleh AI anda?", q3: "Apakah sektor anda?", many: "Pilih semua yang berkenaan.", one: "Pilih satu.",
      all: "Pilih semua", none: "Kosongkan", chosen: n => `${n} dipilih`, next: "Seterusnya", back: "Kembali", show: "Tunjukkan peraturan saya",
      needPlace: "Pilih sekurang-kurangnya satu lokasi.", needUse: "Pilih sekurang-kurangnya satu fungsi AI anda.",
      head: n => n ? `${n} peraturan wajib mungkin terpakai kepada anda` : "Kebanyakannya amalan baik buat masa ini",
      lead: n => n > 4 ? "Banyak perkara untuk dipantau serentak. Penilaian kesediaan boleh menyusunnya mengikut keutamaan." : "Semakan laman web ialah cara cepat untuk mengetahui kedudukan anda.",
      tags: { now: "Terpakai sekarang", coming: "Akan datang", check: "Semak", guide: "Amalan baik" }, count: { now: "wajib sekarang", coming: "akan datang", check: "perlu disemak", guide: "amalan baik" },
      talk: "Bincangkan keputusan saya", email: "Lebih suka e-mel?", emailLink: "Hantar jawapan ini kepada saya", emailEnd: "dan saya akan membalas dengan ringkasan bertulis.", edit: "Ubah jawapan saya", restart: "Mula semula",
      fine: "Petunjuk awal berdasarkan jawapan anda, bukan nasihat undang-undang. Undang-undang kerap berubah; semakan ini kali terakhir dikemas kini pada", english: "Ringkasan undang-undang di bawah dalam bahasa Inggeris buat masa ini.", preview: "Pratonton: terjemahan draf yang menunggu semakan penutur asli." },
    id: { title: "Aturan AI mana yang berlaku bagi Anda?", sub: "Tiga pertanyaan singkat. Pilihan Anda tidak keluar dari peramban Anda.", s1: "Lokasi", s2: "Fungsi AI Anda", s3: "Sektor",
      q1: "Di mana orang-orang yang menggunakan produk atau layanan Anda?", q2: "Apa yang dilakukan AI Anda?", q3: "Apa sektor Anda?", many: "Pilih semua yang sesuai.", one: "Pilih satu.",
      all: "Pilih semua", none: "Hapus pilihan", chosen: n => `${n} dipilih`, next: "Berikutnya", back: "Kembali", show: "Tampilkan aturan saya",
      needPlace: "Pilih setidaknya satu lokasi.", needUse: "Pilih setidaknya satu fungsi AI Anda.",
      head: n => n ? `${n} aturan wajib kemungkinan berlaku bagi Anda` : "Sebagian besar praktik baik untuk saat ini",
      lead: n => n > 4 ? "Cukup banyak yang perlu dipantau sekaligus. Penilaian kesiapan dapat mengurutkannya sesuai prioritas." : "Pemeriksaan situs web adalah cara cepat untuk mengetahui posisi Anda.",
      tags: { now: "Berlaku sekarang", coming: "Akan datang", check: "Periksa", guide: "Praktik baik" }, count: { now: "wajib sekarang", coming: "akan datang", check: "perlu diperiksa", guide: "praktik baik" },
      talk: "Diskusikan hasil saya", email: "Lebih suka email?", emailLink: "Kirimkan jawaban ini kepada saya", emailEnd: "dan saya akan membalas dengan ringkasan tertulis.", edit: "Ubah jawaban saya", restart: "Mulai lagi",
      fine: "Indikasi awal berdasarkan jawaban Anda, bukan nasihat hukum. Hukum sering berubah; pemeriksaan ini terakhir ditinjau pada", english: "Ringkasan hukum di bawah dalam bahasa Inggris untuk saat ini.", preview: "Pratinjau: terjemahan draf yang menunggu tinjauan penutur asli." },
  };
  const REVIEWED = { en: "23 November 2026", ms: "23 November 2026", id: "23 November 2026" };

  // Places: regions first, then their countries. ASEAN is part of Asia; Vietnam is an ASEAN member. Every place listed has AI rules or a GDPR-style data protection law.
  const PLACES = [
    { group: { en: "Europe", ms: "Eropah", id: "Eropa" }, items: [["EU", { en: "European Union", ms: "Kesatuan Eropah", id: "Uni Eropa" }], ["UK", { en: "United Kingdom", ms: "United Kingdom", id: "Inggris Raya" }]] },
    { group: { en: "Asia", ms: "Asia", id: "Asia" }, items: [["KR", { en: "South Korea", ms: "Korea Selatan", id: "Korea Selatan" }]] },
    { group: { en: "ASEAN (in Asia)", ms: "ASEAN (di Asia)", id: "ASEAN (di Asia)" }, items: [["SG", { en: "Singapore", ms: "Singapura", id: "Singapura" }], ["MY", { en: "Malaysia", ms: "Malaysia", id: "Malaysia" }], ["ID", { en: "Indonesia", ms: "Indonesia", id: "Indonesia" }], ["TH", { en: "Thailand", ms: "Thailand", id: "Thailand" }], ["VN", { en: "Vietnam", ms: "Vietnam", id: "Vietnam" }], ["PH", { en: "Philippines", ms: "Filipina", id: "Filipina" }]] },
    { group: { en: "Arab Gulf", ms: "Teluk Arab", id: "Teluk Arab" }, items: [["QA", { en: "Qatar", ms: "Qatar", id: "Qatar" }], ["AE", { en: "United Arab Emirates", ms: "Emiriah Arab Bersatu", id: "Uni Emirat Arab" }], ["SA", { en: "Saudi Arabia", ms: "Arab Saudi", id: "Arab Saudi" }]] },
  ];
  const USES = [
    ["chat", { en: ["Chats with customers or the public", "A chatbot, assistant or voice agent"], ms: ["Berbual dengan pelanggan atau orang ramai", "Chatbot, pembantu maya atau ejen suara"], id: ["Mengobrol dengan pelanggan atau publik", "Chatbot, asisten virtual, atau agen suara"] }],
    ["content", { en: ["Makes images, video or text we publish", "Posts, articles, ads or synthetic media"], ms: ["Menghasilkan imej, video atau teks yang kami terbitkan", "Hantaran, artikel, iklan atau media sintetik"], id: ["Membuat gambar, video, atau teks yang kami terbitkan", "Unggahan, artikel, iklan, atau media sintetis"] }],
    ["screen", { en: ["Screens job or volunteer applicants", "Shortlisting, ranking or testing candidates"], ms: ["Menapis pemohon kerja atau sukarelawan", "Menyenarai pendek, menyusun atau menguji calon"], id: ["Menyaring pelamar kerja atau relawan", "Menyusun daftar pendek, memeringkat, atau menguji kandidat"] }],
    ["decide", { en: ["Decides who gets a service, grade or loan", "Or strongly shapes that decision"], ms: ["Menentukan siapa yang mendapat perkhidmatan, gred atau pinjaman", "Atau banyak mempengaruhi keputusan itu"], id: ["Menentukan siapa yang mendapat layanan, nilai, atau pinjaman", "Atau sangat memengaruhi keputusan itu"] }],
    ["internal", { en: ["Helps staff with writing or research", "Internal tools only"], ms: ["Membantu kakitangan menulis atau membuat kajian", "Alat dalaman sahaja"], id: ["Membantu staf menulis atau meneliti", "Hanya alat internal"] }],
  ];
  const SECTORS = [["education", { en: "Education", ms: "Pendidikan", id: "Pendidikan" }], ["health", { en: "Health", ms: "Kesihatan", id: "Kesehatan" }], ["finance", { en: "Finance", ms: "Kewangan", id: "Keuangan" }], ["nonprofit", { en: "Non-profit", ms: "Badan bukan untung", id: "Nirlaba" }], ["other", { en: "Something else", ms: "Lain-lain", id: "Lainnya" }]];

  // Rules: place, status ("now" binding today, "coming" passed or drafted, "check" may apply, "guide" voluntary), when it applies, title and note.
  // a.where.X, a.use.X and a.sector describe the answers; a.any is always true.
  const hiring = a => a.use.screen || a.use.decide;
  const RULES = [
    // European Union
    { place: "EU", s: "now", when: a => a.use.chat, title: "AI Act Article 50(1): tell people they’re talking to AI", note: "Applies since 2 August 2026 to chatbots and AI assistants, unless it’s obvious from the context." },
    { place: "EU", s: "now", when: a => a.use.content, title: "AI Act Article 50: label AI-generated content", note: "Disclose deepfakes, and AI-generated text published on matters of public interest. Providers of generative AI must mark outputs machine-readably; systems launched before 2 August 2026 have until 2 December 2026." },
    { place: "EU", s: "check", when: a => a.use.content || a.sector === "education" || a.use.screen, title: "AI Act Article 5: banned practices", note: "Emotion recognition in schools and workplaces, social scoring and some biometric uses are banned. From 2 December 2026, so are AI systems that create intimate images of real people without consent, or child sexual abuse material." },
    { place: "EU", s: "coming", when: hiring, title: "AI Act high-risk duties (Annex III)", note: "From 2 December 2027, AI used in hiring, education, credit and access to essential services needs risk management, human oversight, logging and information for affected people." },
    { place: "EU", s: "now", when: hiring, title: "GDPR Article 22: automated decisions", note: "People have the right not to be subject to solely automated decisions with legal or similarly significant effects, unless an exception applies and safeguards are in place." },
    { place: "EU", s: "now", when: a => a.any, title: "AI Act Article 4: AI literacy", note: "Staff who use or oversee AI need a suitable level of AI literacy." },
    { place: "EU", s: "now", when: a => a.any, title: "GDPR: personal data in AI", note: "A lawful basis, clear notices, and a data protection impact assessment where the risk is high." },
    // United Kingdom
    { place: "UK", s: "now", when: hiring, title: "UK GDPR Articles 22A to 22D: automated decisions", note: "Since 5 February 2026, solely automated significant decisions are allowed with safeguards: tell people, let them make representations, offer human review and let them contest the decision. Stricter limits apply to health and other special category data." },
    { place: "UK", s: "now", when: hiring, title: "Equality Act 2010: fair AI decisions", note: "AI used in hiring or service decisions must not discriminate, directly or indirectly, and reasonable adjustments still apply for disabled people." },
    { place: "UK", s: "now", when: a => a.any, title: "UK GDPR: personal data in AI", note: "A lawful basis, clear notices, and a data protection impact assessment where the risk is high." },
    { place: "UK", s: "coming", when: a => a.any, title: "Statutory ICO code of practice on AI", note: "The UK has no AI Act, but the law now requires the regulator to publish a code of practice on AI and automated decisions. Expect it to set the benchmark." },
    { place: "UK", s: "check", when: a => !a.where.EU, title: "UK organisations with EU users", note: "If people in the EU use your AI or see its output, the EU AI Act can apply to you. Choose European Union too to see those rules." },
    // South Korea
    { place: "KR", s: "now", when: a => a.use.chat || a.use.content, title: "AI Basic Act: generative AI notices and labels", note: "Tell users when a service uses generative AI, and label realistic AI content. Fines are expected from January 2027." },
    { place: "KR", s: "now", when: hiring, title: "AI Basic Act: possible high-impact AI", note: "AI in hiring, lending and other significant decisions may count as high-impact, with risk management and explanation duties." },
    { place: "KR", s: "now", when: a => a.any, title: "Personal Information Protection Act", note: "Covers personal data used to train and run AI, including people’s rights over fully automated decisions." },
    { place: "KR", s: "check", when: a => a.any, title: "Domestic representative", note: "Foreign AI businesses above user or revenue thresholds must appoint a representative in Korea." },
    // Vietnam
    { place: "VN", s: "now", when: a => a.any, title: "Law on Artificial Intelligence (Law 134/2025)", note: a => `In force since 1 March 2026. Systems already running before then must comply by ${["health", "education", "finance"].includes(a.sector) ? "September 2027 in your sector" : "March 2027"}.` },
    { place: "VN", s: "now", when: a => a.use.content || a.use.chat, title: "Transparency and labelling of AI content", note: "People must know when they deal with AI, and AI-generated content and deepfakes must be identifiable." },
    { place: "VN", s: "now", when: a => a.any, title: "Personal Data Protection Law (Law 91/2025)", note: "In force since 1 January 2026: consent, impact assessments and rules on transfers abroad." },
    // Singapore
    { place: "SG", s: "now", when: a => a.any, title: "Personal Data Protection Act (PDPA)", note: "Consent, purpose and protection duties, a Data Protection Officer, and notifying the PDPC within 3 calendar days of a notifiable breach." },
    { place: "SG", s: "guide", when: a => hiring(a) || a.use.chat, title: "PDPC guidelines on personal data in AI systems", note: "Advisory guidelines on using personal data in AI recommendation and decision systems, including what to tell people." },
    { place: "SG", s: "guide", when: a => a.any, title: "Model AI Governance Frameworks and AI Verify", note: "Voluntary, but widely used as the regional benchmark, including a framework for generative AI." },
    // Malaysia
    { place: "MY", s: "now", when: a => a.any, title: "Personal Data Protection Act 2010, as amended in 2024", note: "Since 1 June 2025: appoint a Data Protection Officer where thresholds are met, and notify the Commissioner of breaches within 72 hours under its guideline, and affected people where needed." },
    { place: "MY", s: "coming", when: a => a.any, title: "Malaysia AI Governance Bill", note: "Drafted in 2026, with tabling in Parliament targeted for early 2027. Until then, the National Guidelines on AI Governance and Ethics are voluntary." },
    // Indonesia
    { place: "ID", s: "now", when: a => a.any, title: "Personal Data Protection Law (Law 27/2022)", note: "Fully applicable since October 2024: lawful bases, impact assessments, a right to object to solely automated decisions, and breach notice within 3 × 24 hours. The supervisory agency is still being set up." },
    { place: "ID", s: "coming", when: a => a.any, title: "Draft presidential regulations on AI", note: "A national AI roadmap and an AI ethics regulation are awaiting the President’s signature." },
    // Thailand
    { place: "TH", s: "now", when: a => a.any, title: "Personal Data Protection Act B.E. 2562 (2019)", note: "Fully enforced since June 2022, with fines now being issued: lawful bases, a Data Protection Officer for some organisations, and 72-hour breach notification." },
    { place: "TH", s: "coming", when: a => a.any, title: "Draft AI Act", note: "The public hearing closed in August 2026 and the draft is moving to Cabinet. It is expected to include AI labelling and duties for organisations that deploy AI." },
    // Philippines
    { place: "PH", s: "now", when: a => a.any, title: "Data Privacy Act of 2012", note: "Overseen by the National Privacy Commission: registration of some processing systems, notice of automated decisions, and 72-hour breach notification." },
    { place: "PH", s: "guide", when: a => a.use.chat || a.use.content || hiring(a), title: "National Privacy Commission guidance on AI", note: "Guidance on applying the Data Privacy Act to AI systems, including transparency and fairness." },
    { place: "PH", s: "coming", when: a => a.any, title: "AI bills in Congress", note: "Several AI bills are being consolidated in Congress. None is law yet." },
    // Qatar
    { place: "QA", s: "now", when: a => a.any, title: "Personal Data Privacy Protection Law (Law No. 13 of 2016)", note: "The Gulf’s first data protection law: lawful processing, notices, security and breach duties, with extra care for children’s data online. Firms in the Qatar Financial Centre follow its own data protection regulations." },
    { place: "QA", s: "now", when: a => a.sector === "finance", title: "Qatar Central Bank AI Guideline", note: "Binding on firms licensed by the Qatar Central Bank since September 2024: governance, risk management and transparency for AI." },
    { place: "QA", s: "guide", when: a => a.any, title: "National AI strategy and guidance", note: "Government guidance on secure and ethical AI is voluntary today, but sets expectations. Qatar has no AI law." },
    // United Arab Emirates
    { place: "AE", s: "now", when: a => a.any, title: "Personal Data Protection Law (Federal Decree-Law 45/2021)", note: "The federal data law covers AI that uses personal data. Its executive regulations are still awaited, so some details may change." },
    { place: "AE", s: "check", when: a => a.any, title: "Financial free zones: DIFC and ADGM", note: "If you operate in a financial free zone, its own data law applies. In Dubai’s DIFC, Regulation 10 sets binding rules for AI and other autonomous systems that process personal data." },
    { place: "AE", s: "guide", when: a => a.any, title: "UAE Charter for the Development and Use of AI (2024)", note: "Twelve voluntary principles, including transparency, fairness and human oversight." },
    { place: "AE", s: "coming", when: a => a.any, title: "Artificial Intelligence and Data Authority", note: "Created in June 2026 as a single federal regulator for AI and data. Expect new standards. The UAE has no AI law yet." },
    // Saudi Arabia
    { place: "SA", s: "now", when: a => a.any, title: "Personal Data Protection Law (PDPL)", note: "Fully enforced by SDAIA since 14 September 2024, including rules on transfers abroad. SDAIA reported 48 decisions confirming violations in its first full year." },
    { place: "SA", s: "guide", when: a => a.use.chat || a.use.content, title: "SDAIA AI Ethics Principles and Generative AI Guidelines", note: "Voluntary, but increasingly expected in government work: transparency, fairness, accountability and labelling of AI content, including deepfakes." },
    { place: "SA", s: "coming", when: a => a.any, title: "Responsible AI Policy", note: "SDAIA’s consultation closed in May 2026, and binding rules may follow. Saudi Arabia has no AI law yet." },
  ];

  /* ---------- the quiz engine (no content here) ---------- */
  const form = $("#check");
  if (form) {
    const params = new URLSearchParams(location.search), asked = params.get("lang");
    let lang = "en"; try { const saved = localStorage.getItem("aibenar-lang"); if (saved && LANGS[saved]?.ready) lang = saved; } catch {}
    if (asked && LANGS[asked]) lang = asked; // preview of a draft language is allowed by link only
    const T = k => (STR[lang][k] !== undefined && STR[lang][k] !== "" ? STR[lang][k] : STR.en[k]), N = o => o[lang] || o.en;
    const body = $("#qBody"), foot = $("#qFoot"), next = $("#qNext"), back = $("#qBack"), hint = $("#qHint"), result = $("#result"), steps = [...form.querySelectorAll(".q-steps li")];
    const st = { step: 1, where: new Set(), use: new Set(), sector: "other" };
    const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const applyLang = () => {
      form.lang = lang; form.dir = LANGS[lang].dir || "ltr";
      $("#check-title").textContent = T("title"); form.querySelector(".check-sub").textContent = T("sub");
      steps.forEach((li, i) => { li.lastChild.textContent = T(["s1", "s2", "s3"][i]); });
      back.textContent = T("back");
      let sw = form.querySelector(".q-lang"); const avail = Object.entries(LANGS).filter(([k, v]) => v.ready || k === lang);
      if (avail.length > 1) { if (!sw) { sw = document.createElement("div"); sw.className = "q-lang"; sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "Language"); form.querySelector(".q-head").prepend(sw); }
        sw.innerHTML = avail.map(([k, v]) => `<button type="button" lang="${k}" aria-pressed="${k === lang}" data-lang="${k}">${esc(v.name)}</button>`).join(""); } else sw?.remove();
      let pv = form.querySelector(".q-preview"); if (!LANGS[lang].ready) { if (!pv) { pv = document.createElement("p"); pv.className = "q-preview"; form.querySelector(".q-head").append(pv); } pv.textContent = T("preview"); } else pv?.remove();
    };
    form.addEventListener("click", e => { const b = e.target.closest("[data-lang]"); if (!b) return; lang = b.dataset.lang; try { LANGS[lang].ready && localStorage.setItem("aibenar-lang", lang); } catch {} applyLang(); st.done ? showResults() : render(false); });

    function chip(type, name, value, label, checked, sub) { return `<label class="q-opt${sub ? " q-card" : ""}"><input type="${type}" name="${name}" value="${value}"${checked ? " checked" : ""}><span><b>${esc(label)}</b>${sub ? `<small>${esc(sub)}</small>` : ""}</span></label>`; }
    function render(focus = true) {
      st.done = false; result.hidden = true; body.hidden = false; foot.hidden = false; hint.textContent = "";
      steps.forEach((li, i) => { li.classList.toggle("on", i + 1 === st.step); li.classList.toggle("done", i + 1 < st.step); if (i + 1 === st.step) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current"); });
      let h = "";
      if (st.step === 1) h = `<fieldset class="q-step"><legend tabindex="-1">${esc(T("q1"))}<small>${esc(T("many"))}</small></legend>${PLACES.map((g, gi) => `<div class="q-group"><div class="q-ghead"><span>${esc(N(g.group))}</span><button type="button" class="q-link" data-all="${gi}">${g.items.every(([k]) => st.where.has(k)) ? esc(T("none")) : esc(T("all"))}</button></div><div class="q-opts">${g.items.map(([k, n]) => chip("checkbox", "where", k, N(n), st.where.has(k))).join("")}</div></div>`).join("")}<p class="q-count" aria-live="polite">${st.where.size ? esc(STR[lang].chosen ? STR[lang].chosen(st.where.size) : STR.en.chosen(st.where.size)) : ""}</p></fieldset>`;
      if (st.step === 2) h = `<fieldset class="q-step"><legend tabindex="-1">${esc(T("q2"))}<small>${esc(T("many"))}</small></legend><div class="q-opts q-cards">${USES.map(([k, t]) => { const [a, b] = N(t); return chip("checkbox", "use", k, a, st.use.has(k), b); }).join("")}</div></fieldset>`;
      if (st.step === 3) h = `<fieldset class="q-step"><legend tabindex="-1">${esc(T("q3"))}<small>${esc(T("one"))}</small></legend><div class="q-opts">${SECTORS.map(([k, n]) => chip("radio", "sector", k, N(n), st.sector === k)).join("")}</div></fieldset>`;
      body.innerHTML = h; back.hidden = st.step === 1; next.textContent = st.step === 3 ? T("show") : T("next");
      if (focus) body.querySelector("legend")?.focus({ preventScroll: true });
    }
    body.addEventListener("change", e => { const i = e.target; if (i.name === "where") { i.checked ? st.where.add(i.value) : st.where.delete(i.value); body.querySelector(".q-count").textContent = st.where.size ? (STR[lang].chosen || STR.en.chosen)(st.where.size) : ""; const gi = PLACES.findIndex(g => g.items.some(([k]) => k === i.value)), b = body.querySelector(`[data-all="${gi}"]`); if (b) b.textContent = PLACES[gi].items.every(([k]) => st.where.has(k)) ? T("none") : T("all"); }
      if (i.name === "use") i.checked ? st.use.add(i.value) : st.use.delete(i.value); if (i.name === "sector") st.sector = i.value; hint.textContent = ""; });
    body.addEventListener("click", e => { const b = e.target.closest("[data-all]"); if (!b) return; const g = PLACES[+b.dataset.all], all = g.items.every(([k]) => st.where.has(k)); g.items.forEach(([k]) => all ? st.where.delete(k) : st.where.add(k)); render(false); body.querySelector(`[data-all="${b.dataset.all}"]`)?.focus(); });
    back.onclick = () => { if (st.step > 1) { st.step--; render(); } };
    form.addEventListener("submit", e => { e.preventDefault();
      if (st.step === 1 && !st.where.size) { hint.textContent = T("needPlace"); return; }
      if (st.step === 2 && !st.use.size) { hint.textContent = T("needUse"); return; }
      if (st.step < 3) { st.step++; render(); return; }
      showResults(); count("check_done"); });

    function showResults() {
      st.done = true; const a = { where: Object.fromEntries([...st.where].map(w => [w, true])), use: Object.fromEntries([...st.use].map(u => [u, true])), sector: st.sector, any: true };
      const val = v => typeof v === "function" ? v(a) : v, ORDER = { now: 0, coming: 1, check: 2, guide: 3 };
      const hits = RULES.filter(r => a.where[r.place] && r.when(a)), counts = { now: 0, coming: 0, check: 0, guide: 0 }; hits.forEach(r => counts[r.s]++);
      const placeName = k => { for (const g of PLACES) for (const [c, n] of g.items) if (c === k) return N(n); return k; };
      const chosen = PLACES.flatMap(g => g.items.map(([k]) => k)).filter(k => st.where.has(k));
      const mail = encodeURIComponent(`My AI rules check results:\nPlaces: ${chosen.map(k => { for (const g of PLACES) for (const [c, n] of g.items) if (c === k) return n.en; }).join(", ")}\nWhat our AI does: ${USES.filter(([k]) => st.use.has(k)).map(([, t]) => t.en[0]).join(", ")}\nSector: ${SECTORS.find(([k]) => k === st.sector)[1].en}\n\nPlease reply with a written summary of what applies to us.`);
      result.innerHTML = `<div class="q-res-head"><h3>${esc(STR[lang].head(counts.now))}</h3><p class="next">${esc(STR[lang].lead(hits.length))}</p>
        <ul class="q-sum">${Object.entries(counts).filter(([, n]) => n).map(([k, n]) => `<li class="s-${k}"><b>${n}</b> ${esc(STR[lang].count[k])}</li>`).join("")}</ul>${T("english") ? `<p class="q-note">${esc(T("english"))}</p>` : ""}</div>
        ${chosen.map(k => { const rs = hits.filter(r => r.place === k).sort((x, y) => ORDER[x.s] - ORDER[y.s]); return rs.length ? `<section class="q-place"><h4>${esc(placeName(k))}</h4><ul class="rules">${rs.map((r, i) => `<li style="--i:${i}"><span class="tag t-${r.s}">${esc(STR[lang].tags[r.s])}</span><b lang="en">${esc(val(r.title))}</b><small lang="en">${esc(val(r.note))}</small></li>`).join("")}</ul></section>` : ""; }).join("")}
        <div class="q-actions"><a class="btn block" href="#contact" data-track="check_contact">${esc(T("talk"))}</a><div class="q-row"><button type="button" class="btn ghost" id="qEdit">${esc(T("edit"))}</button><button type="button" class="btn ghost" id="qRestart">${esc(T("restart"))}</button></div></div>
        <p class="fine">${esc(T("email"))} <a href="mailto:suhaimizainalshah@gmail.com?subject=${encodeURIComponent("AI rules check: please send a written summary")}&body=${mail}" data-track="check_email">${esc(T("emailLink"))}</a> ${esc(T("emailEnd"))}</p>
        <p class="fine">${esc(T("fine"))} ${esc(REVIEWED[lang] || REVIEWED.en)}.</p>`;
      body.hidden = true; foot.hidden = true; result.hidden = false; steps.forEach(li => { li.classList.remove("on"); li.classList.add("done"); li.removeAttribute("aria-current"); });
      $("#qEdit").onclick = () => { st.step = 1; render(); }; $("#qRestart").onclick = () => { st.where.clear(); st.use.clear(); st.sector = "other"; st.step = 1; render(); };
      result.focus({ preventScroll: true }); result.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    }
    applyLang(); render(false);
  }

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
  const LABELS = { visits: "Visits", check_done: "Checks completed", hero_contact: "Hero: book a call", nav_contact: "Menu: book a call", check_contact: "After check: talk it through", check_email: "After check: email my answers", book_call: "Choose a time", email: "Email clicks", tool_compliscope: "AI Benar link", tool_littlelightlit: "Tools: Little Light Lit on GitHub", tool_ifleavesweave: "Tools: If Leaves Weave on GitHub", tool_sloptical: "AI Asli link" };
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

  /* ---------- 5. binary field ----------
     Hero: a faint field of 0s and 1s settles within about a second, a quiet texture behind the page.
     Contact band: when it scrolls into view, the digits settle into a brass section sign (§), once.
     Respects reduced motion, redraws on resize, and stops completely when finished. */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function bits(canvas) {
    const host = canvas.parentElement, ctx = canvas.getContext("2d"), css = getComputedStyle(document.documentElement);
    const closing = canvas.dataset.bits === "still";
    const base = closing ? css.getPropertyValue("--ledger-ink").trim() : css.getPropertyValue("--ledger").trim();
    const glyphColour = matchMedia("(prefers-color-scheme: dark)").matches ? css.getPropertyValue("--ledger-ink").trim() : css.getPropertyValue("--brass").trim();
    const CELL = 18; let cells = [], W = 0, H = 0, raf = 0, start = 0, done = false, played = false;
    function layout() {
      const r = host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); W = Math.ceil(r.width); H = Math.ceil(r.height);
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let data = null;
      if (closing && W > 760) { // the § only where there is room beside the text
        const m = document.createElement("canvas"), mc = m.getContext("2d"); m.width = W; m.height = H;
        mc.font = `700 ${Math.min(H * 1.15, W * .3)}px "Source Serif 4", Georgia, serif`; mc.textAlign = "center"; mc.textBaseline = "middle";
        mc.fillText("§", W * .88, H * .52); data = mc.getImageData(0, 0, W, H).data;
      }
      cells = [];
      for (let y = CELL / 2; y < H; y += CELL) for (let x = CELL / 2; x < W; x += CELL) {
        const inGlyph = data ? data[((y | 0) * W + (x | 0)) * 4 + 3] > 128 : false;
        cells.push({ x, y, inGlyph, ch: Math.random() < .5 ? "0" : "1", settle: (closing ? 300 : 150) + Math.random() * (closing ? 1300 : 700) + (inGlyph ? 300 : 0) });
      }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H); ctx.font = `500 11px ui-monospace, "SF Mono", Menlo, Consolas, monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      let moving = false;
      for (const c of cells) {
        const settled = done || t >= c.settle;
        if (!settled) { moving = true; if (Math.random() < .3) c.ch = Math.random() < .5 ? "0" : "1"; }
        const k = done ? 1 : Math.min(1, t / c.settle);
        ctx.globalAlpha = c.inGlyph ? .12 + .7 * k : (closing ? .08 : .06);
        ctx.fillStyle = c.inGlyph && settled ? glyphColour : base; ctx.fillText(c.ch, c.x, c.y);
      }
      ctx.globalAlpha = 1; return moving;
    }
    function frame(now) { if (!start) start = now; if (draw(now - start)) raf = requestAnimationFrame(frame); else { done = true; draw(0); } }
    function play() { if (played) return; played = true; if (reduce) { done = true; draw(0); return; } start = 0; raf = requestAnimationFrame(frame); }
    function init() {
      layout();
      if (closing && "IntersectionObserver" in window) { draw(0.0001); const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: .45 }); io.observe(host); }
      else play();
    }
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { cancelAnimationFrame(raf); done = true; played = true; layout(); draw(0); }, 150); });
    (document.fonts?.ready || Promise.resolve()).then(init);
  }
  $$("canvas.bits").forEach(bits);
})();

/* ---------- Back to top: appears after about one screen of scrolling; moves focus to the top for keyboard users ---------- */
(() => {
  const btn = document.getElementById("toTop"); if (!btn) return;
  const sync = () => { btn.hidden = scrollY < innerHeight * 1.1; };
  addEventListener("scroll", sync, { passive: true }); sync();
  document.querySelectorAll('a[href="#top"]').forEach(a => a.addEventListener("click", e => {
    e.preventDefault(); scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    const target = document.querySelector("header a, h1"); if (target) { target.setAttribute("tabindex", target.getAttribute("tabindex") ?? "-1"); target.focus({ preventScroll: true }); }
    history.replaceState(null, "", location.pathname + location.search);
  }));
})();

