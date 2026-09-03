/**
 * profile/config.js
 *
 * Metadados e pesos de cada item de conteúdo do portfólio.
 *
 * COMO ADICIONAR UM NOVO PROJETO OU EXPERIÊNCIA:
 * 1. Adicione o elemento HTML em index.html com o atributo data-profile-id="<id>".
 * 2. Adicione uma entrada neste array com o mesmo id.
 * 3. Defina pesos entre 0 e 10:
 *    - professionalWeight: relevância para recrutadores.
 *    - academicWeight: relevância para professores/avaliadores.
 *    - generalWeight: relevância para visitantes em geral.
 *
 * COMO AJUSTAR PESOS:
 * Altere os valores numéricos abaixo. Pesos mais altos = aparecem primeiro no perfil.
 *
 * COMO ADICIONAR NOVOS PERFIS:
 * 1. Crie uma nova chave em PROFILES (ex: "mentor").
 * 2. Adicione a chave de peso correspondente nos itens (ex: mentorWeight).
 * 3. Adicione as traduções em i18n.js.
 * 4. Adicione o botão no modal em modal.js.
 *
 * AVISO DE SEGURANÇA:
 * Este sistema personaliza a navegação, mas NÃO protege informações privadas.
 * Não armazene senhas, tokens ou dados sensíveis via localStorage.
 * Para conteúdo verdadeiramente privado, implemente autenticação no servidor.
 */

export const PROFILES = {
  recruiter: { weightKey: "professionalWeight" },
  academic:  { weightKey: "academicWeight"     },
  visitor:   { weightKey: "generalWeight"      },
};

export const VALID_PROFILES = Object.keys(PROFILES);

export const STORAGE_KEY = "portfolio.viewer.profile.v1";

/**
 * Catálogo de conteúdos com metadados.
 * Cada item corresponde a um elemento DOM com data-profile-id="<id>".
 *
 * Pesos baseados nos dados reais encontrados no portfólio de Caio Falinacio:
 * - DMind (emprego atual): alta relevância profissional.
 * - FrotaSync (TI interdisciplinar): alta relevância acadêmica.
 * - RHFusion (projeto em equipe): alta relevância profissional/geral.
 * - PUC Minas: alta relevância acadêmica.
 * - IFMG Técnico: relevância mista (formação técnica com foco em gestão).
 */
export const CONTENT_CATALOG = [
  // ── Projetos ──────────────────────────────────────────────────────────────
  {
    id: "rhfusion",
    type: "project",
    tags: ["trabalho-em-equipe", "corporativo", "rh", "fullstack", "universitario"],
    audiences: ["recruiter", "visitor", "academic"],
    professionalWeight: 8,  // Solução corporativa real, trabalho em equipe
    academicWeight:     7,  // Projeto universitário do 2º período
    generalWeight:      7,
  },
  {
    id: "frotasync",
    type: "project",
    tags: ["interdisciplinar", "backend", "cliente-real", "manutencao", "universitario"],
    audiences: ["academic", "recruiter", "visitor"],
    professionalWeight: 6,  // Solução de negócio real, mas contexto é TI acadêmico
    academicWeight:     9,  // Trabalho Interdisciplinar oficial da faculdade
    generalWeight:      7,
  },

  // ── Experiências ──────────────────────────────────────────────────────────
  {
    id: "exp-dmind",
    type: "experience",
    tags: ["empresa", "atual", "desenvolvimento", "resolucao-de-problemas"],
    audiences: ["recruiter", "visitor"],
    professionalWeight: 10, // Emprego atual em empresa real
    academicWeight:     3,
    generalWeight:      8,
  },
  {
    id: "exp-ifmg",
    type: "experience",
    tags: ["formacao-tecnica", "gestao", "lideranca", "administracao"],
    audiences: ["visitor", "academic", "recruiter"],
    professionalWeight: 6,  // Formação técnica com competências de gestão
    academicWeight:     7,  // Formação técnica oficial
    generalWeight:      6,
  },
  {
    id: "exp-puc",
    type: "experience",
    tags: ["universitario", "engenharia-de-software", "lideranca-de-equipe", "formacao"],
    audiences: ["academic", "visitor", "recruiter"],
    professionalWeight: 4,
    academicWeight:     10, // Formação principal em Engenharia de Software
    generalWeight:      7,
  },
];
