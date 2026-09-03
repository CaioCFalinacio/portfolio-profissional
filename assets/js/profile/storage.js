/**
 * profile/storage.js
 *
 * Serviço de persistência do perfil selecionado.
 * Usa localStorage com tratamento de falhas (modo privado, restrições do navegador).
 *
 * AVISO: localStorage é acessível por qualquer script da página.
 * Não armazene dados sensíveis, credenciais ou tokens de autenticação aqui.
 */

import { STORAGE_KEY, VALID_PROFILES } from "./config.js";

/** @returns {boolean} */
function isStorageAvailable() {
  try {
    const probe = "__probe__";
    localStorage.setItem(probe, probe);
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = isStorageAvailable();

/**
 * Salva o perfil escolhido.
 * @param {string} profile
 */
export function saveProfile(profile) {
  if (!storageAvailable) return;
  try {
    localStorage.setItem(STORAGE_KEY, profile);
  } catch {
    // Silencia falhas de escrita (ex: storage cheio)
  }
}

/**
 * Recupera o perfil salvo. Retorna null se ausente, inválido ou inacessível.
 * @returns {string|null}
 */
export function loadProfile() {
  if (!storageAvailable) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    if (!VALID_PROFILES.includes(stored)) {
      // Valor corrompido ou desconhecido → descarta
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return stored;
  } catch {
    return null;
  }
}

/**
 * Remove o perfil salvo (força nova seleção na próxima visita).
 */
export function clearProfile() {
  if (!storageAvailable) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silencia
  }
}
