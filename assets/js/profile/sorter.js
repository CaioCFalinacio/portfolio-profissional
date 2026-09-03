/**
 * profile/sorter.js
 *
 * Serviço de classificação de conteúdos por perfil.
 *
 * Esta lógica é independente do DOM: recebe uma coleção de metadados
 * e retorna os itens ordenados pelo peso do perfil solicitado.
 *
 * Separação intencional: a ordenação não depende da estrutura visual.
 */

import { PROFILES, CONTENT_CATALOG } from "./config.js";

/**
 * Ordena os itens do catálogo para o perfil dado.
 * Itens com maior peso para o perfil aparecem primeiro.
 *
 * @param {string} profile - "recruiter" | "academic" | "visitor"
 * @param {string} [type]  - Filtra por tipo ("project" | "experience"). Omitir = todos.
 * @returns {Array<{id: string, weight: number}>}
 */
export function sortForProfile(profile, type) {
  const profileConfig = PROFILES[profile];
  if (!profileConfig) return [];

  const weightKey = profileConfig.weightKey;

  const items = type
    ? CONTENT_CATALOG.filter((item) => item.type === type)
    : CONTENT_CATALOG;

  return [...items]
    .sort((a, b) => (b[weightKey] ?? 0) - (a[weightKey] ?? 0))
    .map((item) => ({ id: item.id, weight: item[weightKey] ?? 0, type: item.type }));
}

/**
 * Retorna os IDs dos projetos ordenados para o perfil.
 * @param {string} profile
 * @returns {string[]}
 */
export function getSortedProjectIds(profile) {
  return sortForProfile(profile, "project").map((item) => item.id);
}

/**
 * Retorna os IDs das experiências ordenadas para o perfil.
 * @param {string} profile
 * @returns {string[]}
 */
export function getSortedExperienceIds(profile) {
  return sortForProfile(profile, "experience").map((item) => item.id);
}

/**
 * Retorna o item de maior peso para um perfil e tipo.
 * Usado para aplicar destaque discreto ao item principal.
 * @param {string} profile
 * @param {string} type
 * @returns {{id: string, weight: number, type: string}|null}
 */
export function getTopItem(profile, type) {
  const sorted = sortForProfile(profile, type);
  return sorted.length > 0 ? sorted[0] : null;
}
