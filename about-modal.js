/* about-modal.js — Atlas About Modal
   Self-contained: injects styles, HTML, and exposes openAboutModal() / closeAboutModal() globally.
   Include with <script src="about-modal.js"></script> before </body> on any Atlas page. */
(function () {

  /* ── Styles ─────────────────────────────────────────────────────────── */
  var s = document.createElement('style');
  s.textContent = `
    /* About button (placed in nav on each page) */
    .atlas-about-btn {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 0.82rem; font-weight: 600; color: #6B6560;
      background: rgba(255,255,255,0.55); border: 1px solid #E0DDD5;
      border-radius: 99px; padding: 6px 14px; cursor: pointer;
      font-family: 'Inter', -apple-system, sans-serif;
      transition: background 0.2s, color 0.2s, border-color 0.2s;
      white-space: nowrap; flex-shrink: 0; line-height: 1;
    }
    .atlas-about-btn:hover {
      background: #fff; color: #1A1814;
      border-color: rgba(26,24,20,0.2);
    }

    /* Overlay */
    #am-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(26,24,20,0.52);
      backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.22s ease;
    }
    #am-overlay.am-show { opacity: 1; pointer-events: all; }

    /* Modal box */
    .am-box {
      background: #F4F1EA; border-radius: 22px;
      max-width: 640px; width: 100%; max-height: 88vh;
      display: flex; flex-direction: column;
      box-shadow: 0 28px 72px rgba(26,24,20,0.24);
      overflow: hidden;
      transform: translateY(20px) scale(0.97);
      transition: transform 0.28s cubic-bezier(0.34,1.2,0.64,1);
      font-family: 'Inter', -apple-system, sans-serif;
    }
    #am-overlay.am-show .am-box { transform: translateY(0) scale(1); }

    /* Dark header */
    .am-head {
      display: flex; align-items: flex-start;
      justify-content: space-between; gap: 16px;
      padding: 26px 28px 22px;
      background: #1A1814; flex-shrink: 0;
    }
    .am-head-left { display: flex; align-items: center; gap: 14px; }
    .am-logo { height: 38px; width: auto; display: block; border-radius: 8px; }
    .am-title {
      font-size: 1.15rem; font-weight: 800; color: #F4F1EA;
      letter-spacing: -0.4px; margin: 0 0 4px;
    }
    .am-tagline {
      font-size: 0.8rem; color: rgba(244,241,234,0.55);
      font-style: italic; margin: 0;
    }
    .am-x {
      background: rgba(244,241,234,0.1); border: 1px solid rgba(244,241,234,0.15);
      color: rgba(244,241,234,0.65); border-radius: 8px;
      cursor: pointer; padding: 5px 9px; font-size: 1rem; line-height: 1;
      flex-shrink: 0; transition: background 0.15s, color 0.15s;
    }
    .am-x:hover { background: rgba(244,241,234,0.18); color: #F4F1EA; }

    /* Scrollable body */
    .am-body { overflow-y: auto; padding: 26px 28px 4px; flex: 1; }

    /* Sections */
    .am-eyebrow {
      font-size: 0.67rem; font-weight: 700; letter-spacing: 0.9px;
      text-transform: uppercase; color: #9E9A94; margin: 0 0 8px;
    }
    .am-section { margin-bottom: 22px; }
    .am-section p {
      font-size: 0.875rem; color: #3D3B38; line-height: 1.78; margin: 0;
    }
    .am-divider { border: none; border-top: 1px solid #E0DDD5; margin: 0 0 22px; }

    /* Feature cards */
    .am-cards {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    }
    .am-card {
      background: #fff; border: 1px solid #E0DDD5; border-radius: 14px;
      padding: 16px 12px; text-align: center;
    }
    .am-card-icon { font-size: 1.4rem; margin-bottom: 7px; line-height: 1; }
    .am-card-name {
      font-size: 0.79rem; font-weight: 700; color: #1A1814; margin-bottom: 5px;
    }
    .am-card-desc { font-size: 0.73rem; color: #6B6560; line-height: 1.5; }

    /* Audience */
    .am-audience { display: flex; flex-direction: column; gap: 9px; }
    .am-aud-row {
      display: flex; align-items: flex-start; gap: 10px;
      font-size: 0.86rem; color: #3D3B38; line-height: 1.55;
    }
    .am-aud-label {
      font-weight: 700; color: #1A1814; min-width: 68px; flex-shrink: 0;
    }

    /* Contact */
    .am-contact {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      font-size: 0.81rem; color: #6B6560;
    }
    .am-contact a {
      color: #1A1814; font-weight: 600;
      text-decoration: underline; text-underline-offset: 2px;
    }
    .am-cdot { color: #C8C3B8; }

    /* Footer */
    .am-foot {
      padding: 16px 28px 22px; flex-shrink: 0;
      border-top: 1px solid #E0DDD5;
      display: flex; align-items: center;
      justify-content: space-between; gap: 12px;
    }
    .am-powered { font-size: 0.72rem; color: #9E9A94; }
    .am-powered strong { font-weight: 700; color: #6B6560; }
    .am-got-it {
      background: #1A1814; color: #F4F1EA; border: none;
      border-radius: 10px; padding: 9px 22px;
      font-size: 0.84rem; font-weight: 700; cursor: pointer;
      font-family: 'Inter', sans-serif; transition: opacity 0.18s;
    }
    .am-got-it:hover { opacity: 0.84; }

    /* Mobile */
    @media (max-width: 560px) {
      #am-overlay { padding: 0; align-items: flex-end; }
      .am-box { max-height: 92vh; border-radius: 22px 22px 0 0; }
      .am-head { padding: 20px 20px 18px; }
      .am-body { padding: 20px 20px 4px; }
      .am-foot { padding: 14px 20px 20px; }
      .am-cards { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(s);

  /* ── Modal HTML ─────────────────────────────────────────────────────── */
  var overlay = document.createElement('div');
  overlay.id = 'am-overlay';
  overlay.innerHTML = `
    <div class="am-box">

      <div class="am-head">
        <div class="am-head-left">
          <img src="atlas-logo.png" alt="Atlas" class="am-logo">
          <div>
            <h2 class="am-title">About Atlas</h2>
            <p class="am-tagline">Grades tell you what. Atlas tells you why.</p>
          </div>
        </div>
        <button class="am-x" onclick="closeAboutModal()" title="Close">&#x2715;</button>
      </div>

      <div class="am-body">

        <div class="am-section">
          <div class="am-eyebrow">What is Atlas?</div>
          <p>Atlas is an AI-powered exam platform that explains your mistakes — not just grades them. Upload your exam as a PDF or a photo from your phone, and Atlas analyzes what went wrong, why, and exactly how to fix it. In minutes, not weeks.</p>
        </div>

        <hr class="am-divider">

        <div class="am-section">
          <div class="am-eyebrow">The Story</div>
          <p>Atlas was built by Rahim, a student who failed his own IGCSE exams (E's and F's) — not because he didn't know the material, but because nobody could explain his mistakes. He decided to build the tool he needed. Using Atlas on his own retake, he went from E's and F's to A's, an A*, and a B+. The founder is Atlas's first success story.</p>
        </div>

        <hr class="am-divider">

        <div class="am-section">
          <div class="am-eyebrow">What Can Atlas Do?</div>
          <div class="am-cards">
            <div class="am-card">
              <div class="am-card-icon">📝</div>
              <div class="am-card-name">Exam Analysis</div>
              <div class="am-card-desc">Upload an exam, get mistake-by-mistake feedback</div>
            </div>
            <div class="am-card">
              <div class="am-card-icon">📄</div>
              <div class="am-card-name">Summarize</div>
              <div class="am-card-desc">Turn notes and documents into clean study material</div>
            </div>
            <div class="am-card">
              <div class="am-card-icon">✍️</div>
              <div class="am-card-name">Create Exams</div>
              <div class="am-card-desc">Generate custom practice tests instantly</div>
            </div>
          </div>
        </div>

        <hr class="am-divider">

        <div class="am-section">
          <div class="am-eyebrow">Who Is It For?</div>
          <div class="am-audience">
            <div class="am-aud-row"><span class="am-aud-label">Students</span>Understand your mistakes and improve grades</div>
            <div class="am-aud-row"><span class="am-aud-label">Teachers</span>Create and grade exams in seconds</div>
            <div class="am-aud-row"><span class="am-aud-label">Schools</span>Bulk grading and analytics — coming soon</div>
          </div>
        </div>

        <hr class="am-divider">

        <div class="am-section">
          <div class="am-eyebrow">Contact</div>
          <div class="am-contact">
            <a href="mailto:contact.gexoai@gmail.com">contact.gexoai@gmail.com</a>
            <span class="am-cdot">·</span>
            <a href="privacy.html">Privacy Policy</a>
          </div>
        </div>

      </div>

      <div class="am-foot">
        <span class="am-powered">Powered by <strong>GEXO AI</strong></span>
        <button class="am-got-it" onclick="closeAboutModal()">Got it</button>
      </div>

    </div>
  `;

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeAboutModal();
  });

  document.body.appendChild(overlay);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAboutModal();
  });

  /* ── Public API ─────────────────────────────────────────────────────── */
  window.openAboutModal = function () {
    document.getElementById('am-overlay').classList.add('am-show');
    document.body.style.overflow = 'hidden';
  };
  window.closeAboutModal = function () {
    document.getElementById('am-overlay').classList.remove('am-show');
    document.body.style.overflow = '';
  };

})();
