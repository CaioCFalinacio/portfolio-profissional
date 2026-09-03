/**
 * profile.js
 *
 * Ponto de entrada do sistema de personalização por perfil.
 * Coordena: storage, modal, sorter, renderer e i18n.
 *
 * Uso: importado em main.js após o dicionário ser configurado.
 *
 * AVISO DE SEGURANÇA:
 * Este sistema personaliza a navegação, mas NÃO protege informações privadas.
 * Não armazene senhas, tokens ou dados pessoais sensíveis via localStorage.
 */

import { loadProfile, saveProfile } from "./profile/storage.js";
import { createModal, showChangeModal } from "./profile/modal.js";
import { applyProfile } from "./profile/renderer.js";
import { mergeProfileTranslations } from "./profile/i18n.js";

let currentLang = "pt";

/**
 * Inicializa o sistema de perfis.
 * Deve ser chamado após o dicionário de tradução ser configurado.
 *
 * @param {object}   dictionary - Dicionário PT/EN existente em main.js
 * @param {function} getLang    - Função que retorna o idioma ativo ("pt" | "en")
 */
export function initProfileSystem(dictionary, getLang) {
  // Mescla traduções de perfil no dicionário existente
  mergeProfileTranslations(dictionary);

  currentLang = getLang();

  function getTranslations() {
    return dictionary[getLang()] || dictionary["pt"];
  }

  function handleProfileChange(profile) {
    saveProfile(profile);
    currentLang = getLang();
    applyProfile(profile, getTranslations(), () => openChangeModal());
  }

  function openChangeModal() {
    showChangeModal(getTranslations(), handleProfileChange);
  }

  // Verifica perfil salvo
  const savedProfile = loadProfile();

  if (savedProfile) {
    // Perfil existente → aplica sem exibir modal
    applyProfile(savedProfile, getTranslations(), () => openChangeModal());
  } else {
    // Primeira visita → exibe modal obrigatório
    createModal(getTranslations(), handleProfileChange);
  }
}

/**
 * Notifica o sistema de perfil sobre troca de idioma.
 * Deve ser chamado sempre que o idioma mudar em main.js.
 *
 * @param {string}   lang       - Novo idioma
 * @param {object}   dictionary - Dicionário completo
 * @param {function} getLang    - Retorna idioma ativo
 */
export function onLanguageChange(lang, dictionary, getLang) {
  currentLang = lang;
  const savedProfile = loadProfile();
  if (!savedProfile) return;
  const t = dictionary[lang] || dictionary["pt"];
  applyProfile(savedProfile, t, () => {
    showChangeModal(t, (profile) => {
      saveProfile(profile);
      applyProfile(profile, t, () => {});
    });
  });
}
