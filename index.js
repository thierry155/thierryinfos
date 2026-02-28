// Timer persistant
let startTime;
let timerInterval;

function getOrInitStartTime() {
  let saved = localStorage.getItem('quiz_startTime');
  if (saved) return parseInt(saved);
  const now = Date.now();
  localStorage.setItem('quiz_startTime', now);
  return now;
}

startTime = getOrInitStartTime();

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const sec = String(elapsed % 60).padStart(2, '0');
  document.querySelectorAll('#timer').forEach(el => {
    if (el) el.textContent = `${min}:${sec}`;
  });
}

function resetTimer() {
  localStorage.removeItem('quiz_startTime');
  startTime = Date.now();
  localStorage.setItem('quiz_startTime', startTime);
  updateTimer();
}

timerInterval = setInterval(updateTimer, 1000);

// Questions (thème : technologies numériques au service du Burundi)
const questions = [
  {
    q: "Quel secteur au Burundi bénéficie le plus du développement du numérique ces dernières années ?",
    options: ["Agriculture", "Santé", "Éducation", "Tourisme"],
    correct: 0
  },
  {
    q: "Quel est le nom de la stratégie nationale du Burundi pour le développement du numérique ?",
    options: ["Vision Burundi 2025", "Plan National Numérique 2023-2027", "Stratégie e-Burundi 2030", "Burundi Digital 2040"],
    correct: 1
  },
  {
    q: "Quelle technologie est la plus utilisée pour les paiements au Burundi en 2025 ?",
    options: ["Cartes bancaires Visa/Mastercard", "Mobile money (Lumicash, Ecocash, etc.)", "PayPal", "Bitcoin"],
    correct: 1
  },
  {
    q: "Quel projet numérique a permis d’améliorer l’accès à l’éducation pendant et après la pandémie au Burundi ?",
    options: ["Plateforme e-learning du Ministère de l’Éducation", "Khan Academy Burundi", "Coursera gratuit", "Radio-éducation"],
    correct: 0
  },
  {
    q: "En 2025, quelle ville burundaise est considérée comme le principal hub technologique émergent ?",
    options: ["Gitega", "Bujumbura", "Ngozi", "Muramvya"],
    correct: 1
  },
  {
    q: "Quel est l’objectif principal du projet Smart Burundi lancé par le gouvernement ?",
    options: ["Rendre toutes les écoles connectées d’ici 2030", "Digitaliser 80% des services publics d’ici 2028", "Créer 10 000 emplois dans le numérique", "Lancer le 5G partout"],
    correct: 1
  },
  {
    q: "Quelle application mobile est la plus utilisée par les agriculteurs burundais pour vendre leurs produits en 2025 ?",
    options: ["Jumia Burundi", "Iguriro App", "Facebook Marketplace", "WhatsApp Business"],
    correct: 1
  },
  {
    q: "Quel pourcentage approximatif de la population burundaise avait accès à Internet mobile en 2025 ?",
    options: ["~15%", "~35%", "~55%", "~75%"],
    correct: 1
  },
  {
    q: "Quel domaine a connu la plus forte croissance grâce au numérique au Burundi ces 5 dernières années ?",
    options: ["Fintech / services financiers", "Tourisme en ligne", "Jeux vidéo", "Blockchain"],
    correct: 0
  },
  {
    q: "Quel est le plus grand défi pour accélérer le développement numérique au Burundi en 2025 ?",
    options: ["Manque d’électricité et de couverture réseau", "Manque de compétences en programmation", "Prix trop élevés des smartphones", "Tous les trois ci-dessus"],
    correct: 3
  }
];

// Génération mot de passe au clic
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let pass = "";
  for (let i = 0; i < 10; i++) {
    pass += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById('password').value = pass;

  const msgDiv = document.getElementById('password-message');
  if (msgDiv) {
    msgDiv.innerHTML = `Mot de passe généré !! ✅<br><strong>${pass}</strong>`;
    msgDiv.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-generate-password');
  if (btn) btn.addEventListener('click', generatePassword);
});

function saveUserInfo() {
  const nom     = document.getElementById('nom')?.value.trim()     || "";
  const prenom  = document.getElementById('prenom')?.value.trim()  || "";
  const email   = document.getElementById('email')?.value.trim()   || "";
  const password = document.getElementById('password')?.value.trim() || "";

  if (!nom || !prenom || !email || !password) {
    alert("Tous les champs sont obligatoires !\n\nTu dois cliquer sur 'Créer mot de passe'.");
    return false;
  }

  localStorage.setItem('quiz_user', JSON.stringify({
    nom, prenom, email, password,
    startTime: startTime,
    completedAccueil: true
  }));
  return true;
}

function checkAccueilCompleted() {
  const user = JSON.parse(localStorage.getItem('quiz_user') || '{}');
  if (!user.completedAccueil) {
    alert("Tu dois d'abord remplir la page d'inscription !");
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function loadQuiz() {
  const form = document.getElementById('quiz-form');
  if (!form) return;

  form.innerHTML = '';
  questions.forEach((q, i) => {
    let html = `<div class="question-block">
      <p style="font-weight:600; margin-bottom:0.9rem;">${i+1}. ${q.q}</p>
      <div class="options-horizontal">`;
    q.options.forEach((opt, j) => {
      html += `
        <label class="option-label">
          <input type="radio" name="q${i}" value="${j}">
          <span>${opt}</span>
        </label>`;
    });
    html += '</div></div>';
    form.innerHTML += html;
  });
}

function showScoreAndCorrections() {
  let score = 0;
  const results = [];

  questions.forEach((q, i) => {
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    const chosen = sel ? parseInt(sel.value) : -1;
    const correct = chosen === q.correct;
    if (correct) score++;

    results.push({
      question: q.q,
      chosen: chosen >= 0 ? q.options[chosen] : "Pas répondu",
      correctAnswer: q.options[q.correct],
      isCorrect: correct
    });
  });

  const user = JSON.parse(localStorage.getItem('quiz_user') || '{}');
  user.score = score;
  user.quizResults = results;
  localStorage.setItem('quiz_user', JSON.stringify(user));

  // Bloquer définitivement
  document.querySelectorAll('#quiz-form input[type="radio"]').forEach(radio => {
    radio.disabled = true;
  });

  document.querySelectorAll('.option-label').forEach(label => {
    label.style.opacity = '0.45';
    label.style.cursor = 'not-allowed';
    label.style.pointerEvents = 'none';
  });

  // Seulement Continuer
  const btnZone = document.getElementById('buttons-zone');
  btnZone.innerHTML = `
    <a href="commentaire.html" class="btn primary" style="min-width:260px;">
      Continuer vers commentaire →
    </a>
  `;

  const zone = document.getElementById('result-zone');
  const title = document.getElementById('score-title');
  const detail = document.getElementById('corrections-detail');

  title.innerHTML = `Ton score : <span style="color:#6366f1;font-size:2.4rem;">${score} / 10</span> 
    ${score >= 8 ? '→ Excellent ! 🎉' : score >= 5 ? '→ Pas mal ! 👍' : '→ À travailler 📚'}`;

  let html = '';
  results.forEach((r, i) => {
    const cls = r.isCorrect ? 'correct' : 'incorrect';
    const txt = r.isCorrect ? 'Correct ✓' : 'Incorrect ✗';
    html += `
      <div class="correction-item ${cls}">
        <strong>${i+1}. ${r.question}</strong><br>
        Ta réponse : <strong>${r.chosen}</strong><br>
        Bonne réponse : <strong>${r.correctAnswer}</strong><br>
        <span class="status">${txt}</span>
      </div>`;
  });
  detail.innerHTML = html;
  zone.style.display = 'block';
}

function submitAndGoToMerci() {
  const commentaire = document.getElementById('commentaire')?.value.trim();
  if (!commentaire) {
    alert("Le commentaire est obligatoire !");
    return;
  }

  const user = JSON.parse(localStorage.getItem('quiz_user') || '{}');
  user.commentaire = commentaire;
  user.endTime = Date.now();

  // Envoi vers ton Google Sheet
  fetch('https://script.google.com/macros/s/AKfycby8hEuJh79jqKuLpFlRLDQrfyGX1JLAH4r3zakw_Zdhs_xRrfVIjpH21EZNWR-ips0p4g/exec', {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: user.password,
      score: user.score || 0,
      commentaire: user.commentaire
    })
  })
  .then(() => {
    // Nettoyage et redirection
    localStorage.removeItem('quiz_user');
    localStorage.removeItem('quiz_startTime');
    window.location.href = 'merci.html';
  })
  .catch(() => {
    // Même en cas d'erreur, on continue vers merci.html
    localStorage.removeItem('quiz_user');
    localStorage.removeItem('quiz_startTime');
    window.location.href = 'merci.html';
  });
}

function showFinalTime() {
  const el = document.getElementById('final-time');
  if (!el) return;

  const data = JSON.parse(localStorage.getItem('quiz_user') || '{}');
  if (data.startTime && data.endTime) {
    const sec = Math.floor((data.endTime - data.startTime) / 1000);
    const min = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    el.textContent = `Temps total : ${min}:${s}`;
  }
}

// Protections
if (location.pathname.includes('presentation.html') ||
    location.pathname.includes('question.html') ||
    location.pathname.includes('commentaire.html')) {
  window.addEventListener('load', checkAccueilCompleted);
}

if (location.pathname.includes('commentaire.html')) {
  window.addEventListener('beforeunload', (e) => {
    const comm = document.getElementById('commentaire')?.value.trim();
    if (!comm) {
      e.preventDefault();
      e.returnValue = "";
    }
  });
}

// Init
if (document.getElementById('form-accueil')) {
  document.getElementById('form-accueil').addEventListener('submit', e => {
    e.preventDefault();
    if (saveUserInfo()) window.location.href = 'presentation.html';
  });
}

if (document.getElementById('quiz-form')) loadQuiz();
if (location.pathname.includes('merci.html')) showFinalTime();