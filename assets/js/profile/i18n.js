/**
 * profile/i18n.js
 *
 * Extensão das traduções para o sistema de perfis.
 * Integra-se ao dicionário existente em main.js via mergeProfileTranslations().
 *
 * COMO ADICIONAR TRADUÇÃO PARA UM NOVO PERFIL:
 * Adicione a chave em ambos os blocos "pt" e "en".
 */

export const PROFILE_TRANSLATIONS = {
  pt: {
    // Modal de seleção
    modalWho:          "Quem está visitando?",
    modalDesc:         "Personalizamos a apresentação conforme seu interesse.",
    modalNote:         "Esta seleção personaliza a navegação, mas não protege informações privadas.",
    profileRecruiter:  "Recrutador",
    profileAcademic:   "Professor ou Avaliador",
    profileVisitor:    "Visitante",
    profileRecruiterDesc: "Prioriza experiência, impacto e competências profissionais.",
    profileAcademicDesc:  "Prioriza formação, fundamentos e trajetória acadêmica.",
    profileVisitorDesc:   "Apresenta uma visão geral e equilibrada.",

    // Indicador no header
    viewingAs:         "Você vê como:",
    changeProfile:     "Trocar perfil",

    // Linha de contexto no hero
    contextRecruiter: "Ênfase em experiência profissional e projetos com impacto real.",
    contextAcademic:  "Ênfase em formação, projetos interdisciplinares e fundamentos técnicos.",
    contextVisitor:   "Uma visão geral da trajetória e competências.",

    // CTA personalizado
    ctaRecruiter: "Ver Experiências",
    ctaAcademic:  "Ver Projetos Acadêmicos",
    ctaVisitor:   "Ver Projetos",
  },
  en: {
    // Selection modal
    modalWho:          "Who is visiting?",
    modalDesc:         "We personalize the presentation based on your interest.",
    modalNote:         "This selection personalizes browsing but does not protect private information.",
    profileRecruiter:  "Recruiter",
    profileAcademic:   "Professor or Evaluator",
    profileVisitor:    "Visitor",
    profileRecruiterDesc: "Prioritizes professional experience, impact, and key skills.",
    profileAcademicDesc:  "Prioritizes academic background, fundamentals, and learning journey.",
    profileVisitorDesc:   "Presents a balanced, general overview.",

    // Header indicator
    viewingAs:         "Viewing as:",
    changeProfile:     "Switch profile",

    // Context line in hero
    contextRecruiter: "Emphasis on professional experience and real-world impact.",
    contextAcademic:  "Emphasis on education, interdisciplinary projects, and technical foundations.",
    contextVisitor:   "A general overview of the journey and competencies.",

    // Personalized CTA
    ctaRecruiter: "View Experience",
    ctaAcademic:  "View Academic Projects",
    ctaVisitor:   "View Projects",
  },
};

/**
 * Mescla as traduções de perfil no dicionário existente.
 * @param {object} existingDictionary - O dicionário já existente em main.js
 */
export function mergeProfileTranslations(existingDictionary) {
  for (const lang of ["pt", "en"]) {
    if (existingDictionary[lang]) {
      Object.assign(existingDictionary[lang], PROFILE_TRANSLATIONS[lang]);
    }
  }
}
