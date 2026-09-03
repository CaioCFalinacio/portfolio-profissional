/**
 * profile/renderer.js
 *
 * Componente de apresentação.
 * Aplica ao DOM as mudanças visuais resultantes da troca de perfil:
 * - Reordena projetos e experiências.
 * - Aplica destaque discreto ao item de maior peso.
 * - Atualiza a linha de contexto no hero.
 * - Atualiza o indicador de perfil no cabeçalho.
 * - Atualiza o CTA (botão) do hero conforme o perfil.
 * - Reinicia as animações de fade-in dos itens reordenados.
 *
 * Princípios:
 * - Não duplica elementos.
 * - Não cria conteúdo que não existe no HTML.
 * - Reordena apenas via Node.appendChild (DOM nativo, sem innerHTML global).
 */

import { getSortedProjectIds, getSortedExperienceIds, getTopItem } from "./sorter.js";

const FEATURED_CLASS = "profile-featured";

/**
 * Reordena uma lista de elementos DOM conforme os IDs ordenados.
 * Remove o destaque de todos antes de aplicar ao primeiro.
 *
 * @param {HTMLElement|null} container - Elemento pai (timeline ou cards-grid)
 * @param {string[]} orderedIds        - IDs na ordem desejada
 * @param {string}   topId            - ID do item que recebe destaque
 */
function reorderItems(container, orderedIds, topId) {
  if (!container) return;

  // Remove destaque de todos os itens do container
  container.querySelectorAll(`[data-profile-id]`).forEach((el) => {
    el.classList.remove(FEATURED_CLASS);
  });

  // Reordena sem duplicar: apenas move referências no DOM
  for (const id of orderedIds) {
    const el = container.querySelector(`[data-profile-id="${id}"]`);
    if (el) {
      container.appendChild(el); // Move para o final na ordem correta
    }
  }

  // Aplica destaque ao item de maior peso
  if (topId) {
    const topEl = container.querySelector(`[data-profile-id="${topId}"]`);
    if (topEl) topEl.classList.add(FEATURED_CLASS);
  }
}

/**
 * Reinicia as animações de fade-in dos itens de um container.
 * Necessário porque a reordenação move elementos que já foram animados.
 * Respeita prefers-reduced-motion.
 *
 * @param {HTMLElement|null} container
 */
function reinitAnimations(container) {
  if (!container) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = container.querySelectorAll("[data-profile-id]");

  items.forEach((el) => {
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    // Reset para que o IntersectionObserver possa re-acionar
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  });

  // Re-observa com IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach((el) => observer.observe(el));
}

/**
 * Atualiza o indicador de perfil no cabeçalho.
 * Cria o elemento se não existir.
 *
 * @param {string} profile  - Perfil ativo
 * @param {object} t        - Traduções ativas
 * @param {function} onChangeCb - Callback para trocar o perfil
 */
export function updateProfileIndicator(profile, t, onChangeCb) {
  const INDICATOR_ID = "profile-indicator";
  const container = document.querySelector(".nav-container");
  if (!container) return;

  let indicator = document.getElementById(INDICATOR_ID);
  if (!indicator) {
    indicator = document.createElement("div");
    indicator.id = INDICATOR_ID;
    indicator.className = "profile-indicator";
    container.appendChild(indicator);
  }

  const labels = {
    recruiter: t.profileRecruiter,
    academic:  t.profileAcademic,
    visitor:   t.profileVisitor,
  };

  indicator.innerHTML = `
    <span class="profile-indicator-label">${t.viewingAs}</span>
    <button class="profile-indicator-btn" type="button"
            aria-label="${t.changeProfile}: ${labels[profile] || profile}">
      ${labels[profile] || profile}
      <span class="profile-indicator-icon" aria-hidden="true">▾</span>
    </button>
  `;

  const btn = indicator.querySelector(".profile-indicator-btn");
  if (btn && onChangeCb) {
    btn.addEventListener("click", onChangeCb);
  }
}

/**
 * Atualiza a linha de contexto no hero section.
 * Cria o elemento se não existir; não modifica se o portfólio não tiver hero-text.
 *
 * @param {string} profile
 * @param {object} t
 */
export function updateContextLine(profile, t) {
  const CONTEXT_ID = "profile-context-line";
  const heroText = document.querySelector(".hero-text");
  if (!heroText) return;

  let contextLine = document.getElementById(CONTEXT_ID);
  if (!contextLine) {
    contextLine = document.createElement("p");
    contextLine.id = CONTEXT_ID;
    contextLine.className = "profile-context-line";

    // Insere após o parágrafo de bio (#bio-text)
    const bioText = document.getElementById("bio-text");
    const insertAfter = bioText || heroText.lastElementChild;
    if (insertAfter && insertAfter.parentNode === heroText) {
      insertAfter.insertAdjacentElement("afterend", contextLine);
    } else {
      heroText.appendChild(contextLine);
    }
  }

  const contextMap = {
    recruiter: t.contextRecruiter,
    academic:  t.contextAcademic,
    visitor:   t.contextVisitor,
  };
  contextLine.textContent = contextMap[profile] || "";
}

/**
 * Atualiza o texto do botão "Ver Projetos" no hero conforme o perfil.
 * @param {string} profile
 * @param {object} t
 */
export function updateHeroCta(profile, t) {
  const btnProjects = document.getElementById("btn-projects");
  if (!btnProjects) return;

  const ctaMap = {
    recruiter: { text: t.ctaRecruiter, href: "#experiencias" },
    academic:  { text: t.ctaAcademic,  href: "#projetos"     },
    visitor:   { text: t.ctaVisitor,   href: "#projetos"     },
  };

  const cta = ctaMap[profile];
  if (!cta) return;
  btnProjects.textContent = cta.text;
  btnProjects.setAttribute("href", cta.href);
}

/**
 * Aplica todas as mudanças de perfil ao DOM.
 *
 * @param {string}   profile     - Perfil ativo
 * @param {object}   t           - Traduções ativas
 * @param {function} onChangeCb  - Callback para trocar o perfil (botão no header)
 */
export function applyProfile(profile, t, onChangeCb) {
  // 1. Reordena projetos
  const timelineContainer = document.querySelector(".timeline");
  const sortedProjects = getSortedProjectIds(profile);
  const topProject = getTopItem(profile, "project");
  reorderItems(timelineContainer, sortedProjects, topProject?.id || null);
  reinitAnimations(timelineContainer);

  // 2. Reordena experiências
  const cardsContainer = document.querySelector(".cards-grid");
  const sortedExperiences = getSortedExperienceIds(profile);
  const topExperience = getTopItem(profile, "experience");
  reorderItems(cardsContainer, sortedExperiences, topExperience?.id || null);
  reinitAnimations(cardsContainer);

  // 3. Atualiza indicador no header
  updateProfileIndicator(profile, t, onChangeCb);

  // 4. Atualiza linha de contexto no hero
  updateContextLine(profile, t);

  // 5. Atualiza CTA do hero
  updateHeroCta(profile, t);
}
