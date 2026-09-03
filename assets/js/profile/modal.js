/**
 * profile/modal.js
 *
 * Componente de seleção de perfil.
 * Exibido na primeira visita ou quando o usuário clica em "Trocar perfil".
 *
 * Acessibilidade:
 * - role="dialog" e aria-modal="true"
 * - aria-labelledby e aria-describedby vinculados
 * - Foco gerenciado ao abrir/fechar
 * - Navegável por teclado (Tab, Escape)
 * - Botões com mínimo 44×44px via CSS
 * - Respeita prefers-reduced-motion
 */

import { VALID_PROFILES } from "./config.js";

const MODAL_ID    = "profile-selection-modal";
const OVERLAY_ID  = "profile-modal-overlay";

/**
 * Cria e injeta o modal no DOM. Não duplica se já existir.
 * @param {object} t - Traduções ativas (resultado de getDictionary(lang))
 * @param {function} onSelect - Callback com o perfil escolhido: (profile: string) => void
 */
export function createModal(t, onSelect) {
  if (document.getElementById(OVERLAY_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.className = "pprofile-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "pprofile-title");
  overlay.setAttribute("aria-describedby", "pprofile-desc");

  overlay.innerHTML = `
    <div class="pprofile-modal" id="${MODAL_ID}">
      <h2 class="pprofile-title" id="pprofile-title">${t.modalWho}</h2>
      <p class="pprofile-desc" id="pprofile-desc">${t.modalDesc}</p>

      <div class="pprofile-options" role="group" aria-label="${t.modalWho}">
        <button class="pprofile-btn" data-profile="recruiter" type="button">
          <span class="pprofile-btn-icon" aria-hidden="true">💼</span>
          <span class="pprofile-btn-label">${t.profileRecruiter}</span>
          <span class="pprofile-btn-sub">${t.profileRecruiterDesc}</span>
        </button>
        <button class="pprofile-btn" data-profile="academic" type="button">
          <span class="pprofile-btn-icon" aria-hidden="true">🎓</span>
          <span class="pprofile-btn-label">${t.profileAcademic}</span>
          <span class="pprofile-btn-sub">${t.profileAcademicDesc}</span>
        </button>
        <button class="pprofile-btn" data-profile="visitor" type="button">
          <span class="pprofile-btn-icon" aria-hidden="true">👤</span>
          <span class="pprofile-btn-label">${t.profileVisitor}</span>
          <span class="pprofile-btn-sub">${t.profileVisitorDesc}</span>
        </button>
      </div>

      <p class="pprofile-note">${t.modalNote}</p>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  // Foco no primeiro botão ao abrir
  const firstBtn = overlay.querySelector(".pprofile-btn");
  if (firstBtn) setTimeout(() => firstBtn.focus(), 50);

  // Delegação de clique nas opções
  overlay.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-profile]");
    if (!btn) return;
    const profile = btn.dataset.profile;
    if (!VALID_PROFILES.includes(profile)) return;
    closeModal();
    onSelect(profile);
  });

  // Fechar com Escape — bloqueado: seleção é obrigatória na primeira visita
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Tab") trapFocus(e, overlay);
  });
}

/** Fecha e remove o modal do DOM. */
export function closeModal() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;
  document.body.style.overflow = "";
  overlay.remove();
}

/** Mantém o foco dentro do modal (trap focus). */
function trapFocus(e, container) {
  const focusable = Array.from(
    container.querySelectorAll("button, [tabindex]:not([tabindex='-1'])")
  ).filter((el) => !el.disabled);

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/**
 * Exibe o modal de troca de perfil (permite Escape para cancelar).
 * @param {object} t
 * @param {function} onSelect
 */
export function showChangeModal(t, onSelect) {
  closeModal();
  createModal(t, onSelect);

  // Na troca, Escape cancela
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;
  overlay.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}
