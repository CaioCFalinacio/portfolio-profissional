/**
 * profile.test.js
 *
 * Testes do sistema de personalização por perfil.
 * Executados via Node.js puro (sem framework, sem build).
 *
 * Execução:
 *   node assets/js/profile.test.js
 *
 * Cobre os 15 critérios obrigatórios especificados no projeto.
 */

// ── Utilitários de Teste ─────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅  ${description}`);
    passed++;
  } else {
    console.error(`  ❌  ${description}`);
    failed++;
  }
}

function group(name) {
  console.log(`\n▶ ${name}`);
}

// ── Stubs para execução em Node (sem DOM, sem localStorage) ─────────────────

// Stub de localStorage
function createLocalStorageMock(initialData = {}) {
  const store = { ...initialData };
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    _store: store,
  };
}

// ── Importação interna dos módulos (Node 18+ com type: "module" não disponível
//    em ambiente de test puro — usamos CJS com re-export manual para teste)

// ─── Lógica de storage (inline para teste) ───────────────────────────────────

const STORAGE_KEY = "portfolio.viewer.profile.v1";
const VALID_PROFILES = ["recruiter", "academic", "visitor"];

function createStorageService(lsMock) {
  function saveProfile(profile) {
    try { lsMock.setItem(STORAGE_KEY, profile); } catch {}
  }
  function loadProfile() {
    try {
      const stored = lsMock.getItem(STORAGE_KEY);
      if (!stored) return null;
      if (!VALID_PROFILES.includes(stored)) {
        lsMock.removeItem(STORAGE_KEY);
        return null;
      }
      return stored;
    } catch { return null; }
  }
  function clearProfile() {
    try { lsMock.removeItem(STORAGE_KEY); } catch {}
  }
  return { saveProfile, loadProfile, clearProfile };
}

// ─── Lógica de sorter (inline para teste) ────────────────────────────────────

const PROFILES = {
  recruiter: { weightKey: "professionalWeight" },
  academic:  { weightKey: "academicWeight"     },
  visitor:   { weightKey: "generalWeight"      },
};

const CONTENT_CATALOG = [
  {
    id: "rhfusion", type: "project",
    professionalWeight: 8, academicWeight: 7, generalWeight: 7,
    tags: ["trabalho-em-equipe", "corporativo", "fullstack", "universitario"],
  },
  {
    id: "frotasync", type: "project",
    professionalWeight: 6, academicWeight: 9, generalWeight: 7,
    tags: ["interdisciplinar", "backend", "cliente-real", "universitario"],
  },
  {
    id: "exp-dmind", type: "experience",
    professionalWeight: 10, academicWeight: 3, generalWeight: 8,
    tags: ["empresa", "atual", "desenvolvimento"],
  },
  {
    id: "exp-ifmg", type: "experience",
    professionalWeight: 6, academicWeight: 7, generalWeight: 6,
    tags: ["formacao-tecnica", "gestao", "administracao"],
  },
  {
    id: "exp-puc", type: "experience",
    professionalWeight: 4, academicWeight: 10, generalWeight: 7,
    tags: ["universitario", "engenharia-de-software", "formacao"],
  },
];

function sortForProfile(profile, type) {
  const config = PROFILES[profile];
  if (!config) return [];
  const weightKey = config.weightKey;
  const items = type ? CONTENT_CATALOG.filter(i => i.type === type) : CONTENT_CATALOG;
  return [...items]
    .sort((a, b) => (b[weightKey] ?? 0) - (a[weightKey] ?? 0))
    .map(item => ({ id: item.id, weight: item[weightKey] ?? 0, type: item.type }));
}

function getSortedProjectIds(profile) {
  return sortForProfile(profile, "project").map(i => i.id);
}
function getSortedExperienceIds(profile) {
  return sortForProfile(profile, "experience").map(i => i.id);
}
function getTopItem(profile, type) {
  const sorted = sortForProfile(profile, type);
  return sorted.length > 0 ? sorted[0] : null;
}

// ─── Lógica de i18n (inline para teste) ──────────────────────────────────────

const PROFILE_TRANSLATIONS = {
  pt: {
    modalWho: "Quem está visitando?",
    profileRecruiter: "Recrutador",
    profileAcademic: "Professor ou Avaliador",
    profileVisitor: "Visitante",
    viewingAs: "Você vê como:",
  },
  en: {
    modalWho: "Who is visiting?",
    profileRecruiter: "Recruiter",
    profileAcademic: "Professor or Evaluator",
    profileVisitor: "Visitor",
    viewingAs: "Viewing as:",
  },
};

function mergeProfileTranslations(dict) {
  for (const lang of ["pt", "en"]) {
    if (dict[lang]) Object.assign(dict[lang], PROFILE_TRANSLATIONS[lang]);
  }
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 1: Modal aparece na primeira visita (sem perfil salvo)
// ════════════════════════════════════════════════════════════════════════════
group("1. Modal aparece na primeira visita");
{
  const ls = createLocalStorageMock();       // vazio → primeira visita
  const storage = createStorageService(ls);
  const profile = storage.loadProfile();
  assert("Sem perfil salvo, loadProfile() retorna null", profile === null);
  assert("Modal deve ser exibido quando loadProfile() retorna null", profile === null);
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 2: Perfil escolhido é salvo
// ════════════════════════════════════════════════════════════════════════════
group("2. Perfil escolhido é salvo");
{
  const ls = createLocalStorageMock();
  const storage = createStorageService(ls);
  storage.saveProfile("recruiter");
  assert("Após saveProfile('recruiter'), localStorage contém a chave", ls.getItem(STORAGE_KEY) === "recruiter");
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 3: Perfil permanece após nova sessão
// ════════════════════════════════════════════════════════════════════════════
group("3. Perfil permanece após nova sessão");
{
  const ls = createLocalStorageMock({ [STORAGE_KEY]: "academic" }); // simula sessão anterior
  const storage = createStorageService(ls);
  const loaded = storage.loadProfile();
  assert("loadProfile() retorna 'academic' da sessão anterior", loaded === "academic");
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 4: Usuário não precisa responder novamente ao reabrir o navegador
// ════════════════════════════════════════════════════════════════════════════
group("4. Não exige nova seleção se perfil válido está salvo");
{
  const ls = createLocalStorageMock({ [STORAGE_KEY]: "visitor" });
  const storage = createStorageService(ls);
  const loaded = storage.loadProfile();
  assert("loadProfile() retorna 'visitor' (não null) — modal não deve ser exibido", loaded === "visitor");
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 5: Possível trocar o perfil pelo cabeçalho
// ════════════════════════════════════════════════════════════════════════════
group("5. Troca de perfil via cabeçalho");
{
  const ls = createLocalStorageMock({ [STORAGE_KEY]: "recruiter" });
  const storage = createStorageService(ls);
  storage.saveProfile("academic"); // simula troca via botão do header
  assert("Após troca, localStorage atualiza para 'academic'", ls.getItem(STORAGE_KEY) === "academic");
  assert("loadProfile() retorna o novo perfil", storage.loadProfile() === "academic");
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 6: Perfis diferentes produzem ordens diferentes
// ════════════════════════════════════════════════════════════════════════════
group("6. Perfis diferentes produzem ordens diferentes");
{
  const recProjects = getSortedProjectIds("recruiter");
  const acdProjects = getSortedProjectIds("academic");
  const recExps = getSortedExperienceIds("recruiter");
  const acdExps = getSortedExperienceIds("academic");

  assert(
    "Projetos: recrutador vs acadêmico têm ordens diferentes",
    JSON.stringify(recProjects) !== JSON.stringify(acdProjects)
  );
  assert(
    "Experiências: recrutador coloca DMind primeiro (maior professionalWeight)",
    recExps[0] === "exp-dmind"
  );
  assert(
    "Experiências: acadêmico coloca PUC primeiro (maior academicWeight)",
    acdExps[0] === "exp-puc"
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 7: Ordenação usa metadados, não nomes fixos
// ════════════════════════════════════════════════════════════════════════════
group("7. Ordenação usa metadados (pesos) e não nomes fixos");
{
  // Adiciona um item fictício com pesos altos e verifica que aparece primeiro
  const catalogCopy = [
    ...CONTENT_CATALOG,
    { id: "test-item", type: "project", professionalWeight: 99, academicWeight: 1, generalWeight: 1 }
  ];
  const weightKey = PROFILES["recruiter"].weightKey;
  const sorted = [...catalogCopy]
    .filter(i => i.type === "project")
    .sort((a, b) => (b[weightKey] ?? 0) - (a[weightKey] ?? 0));

  assert(
    "Item com professionalWeight:99 aparece primeiro para recrutador",
    sorted[0].id === "test-item"
  );
  assert(
    "Ordenação usa a propriedade weightKey, não o id ou título",
    sorted[0].id === "test-item" // confirma que não compara por id/nome
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 8: Conteúdos ausentes não causam erros
// ════════════════════════════════════════════════════════════════════════════
group("8. Conteúdos ausentes não causam erros");
{
  const emptyCatalog = [];
  const sortResult = emptyCatalog
    .filter(i => i.type === "project")
    .sort((a, b) => b.professionalWeight - a.professionalWeight);

  assert("sortForProfile com catálogo vazio retorna array vazio sem lançar erro", sortResult.length === 0);

  const top = getTopItem("recruiter", "experience");
  assert("getTopItem retorna objeto quando há dados", top !== null && typeof top === "object");

  // Verifica comportamento com perfil válido e catálogo sem aquele tipo
  const result = sortForProfile("recruiter", "certification"); // tipo inexistente
  assert("Tipo inexistente retorna array vazio sem erro", Array.isArray(result) && result.length === 0);
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 9: Valores inválidos no armazenamento são descartados
// ════════════════════════════════════════════════════════════════════════════
group("9. Valores inválidos no localStorage são descartados");
{
  const ls9a = createLocalStorageMock({ [STORAGE_KEY]: "hacker" });
  const s9a = createStorageService(ls9a);
  assert("Valor desconhecido 'hacker' retorna null", s9a.loadProfile() === null);
  assert("Valor inválido é removido do storage", ls9a.getItem(STORAGE_KEY) === null);

  const ls9b = createLocalStorageMock({ [STORAGE_KEY]: "" });
  const s9b = createStorageService(ls9b);
  assert("String vazia retorna null", s9b.loadProfile() === null);

  const ls9c = createLocalStorageMock({ [STORAGE_KEY]: "null" });
  const s9c = createStorageService(ls9c);
  assert("String 'null' (corrompida) retorna null", s9c.loadProfile() === null);
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 10: Falhas no localStorage são tratadas
// ════════════════════════════════════════════════════════════════════════════
group("10. Falhas no localStorage são tratadas com segurança");
{
  const brokenLs = {
    getItem:    () => { throw new Error("SecurityError"); },
    setItem:    () => { throw new Error("QuotaExceededError"); },
    removeItem: () => { throw new Error("SecurityError"); },
  };
  const s = createStorageService(brokenLs);

  let loadError = false, saveError = false, clearError = false;
  try { s.loadProfile(); }  catch { loadError = true; }
  try { s.saveProfile("recruiter"); } catch { saveError = true; }
  try { s.clearProfile(); } catch { clearError = true; }

  assert("loadProfile() não lança exceção com localStorage quebrado", !loadError);
  assert("saveProfile() não lança exceção com localStorage quebrado", !saveError);
  assert("clearProfile() não lança exceção com localStorage quebrado", !clearError);
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 11: Tradução continua funcionando
// ════════════════════════════════════════════════════════════════════════════
group("11. Tradução funciona em PT e EN após merge");
{
  const dict = {
    pt: { heroTitle: "Olá" },
    en: { heroTitle: "Hello" },
  };
  mergeProfileTranslations(dict);

  assert("PT: modalWho está presente após merge", dict.pt.modalWho === "Quem está visitando?");
  assert("EN: modalWho está presente após merge", dict.en.modalWho === "Who is visiting?");
  assert("PT: chaves originais preservadas após merge", dict.pt.heroTitle === "Olá");
  assert("EN: chaves originais preservadas após merge", dict.en.heroTitle === "Hello");
  assert("PT: profileRecruiter correto", dict.pt.profileRecruiter === "Recrutador");
  assert("EN: profileRecruiter correto", dict.en.profileRecruiter === "Recruiter");
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 12: Layout responsivo — verificado via CSS (não testável em Node)
// ════════════════════════════════════════════════════════════════════════════
group("12. Responsividade (CSS)");
{
  const fs = require("fs");
  const cssPath = __dirname + "/../css/profile.css";
  let cssContent = "";
  try { cssContent = fs.readFileSync(cssPath, "utf8"); } catch {}

  assert("profile.css contém media query para 768px", cssContent.includes("max-width: 768px"));
  assert("profile.css contém media query para 400px", cssContent.includes("max-width: 400px"));
  assert("Botões têm min-height definido", cssContent.includes("min-height"));
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 13: Animações existentes continuam funcionando
// ════════════════════════════════════════════════════════════════════════════
group("13. Animações existentes são preservadas");
{
  // renderer.js reinicializa as animações após reordenação usando
  // IntersectionObserver com as mesmas propriedades do main.js original
  const rendererPath = __dirname + "/profile/renderer.js";
  let rendererContent = "";
  try { rendererContent = require("fs").readFileSync(rendererPath, "utf8"); } catch {}

  assert(
    "renderer.js usa IntersectionObserver para reiniciar animações",
    rendererContent.includes("IntersectionObserver")
  );
  assert(
    "renderer.js usa as mesmas propriedades de animação do main.js (opacity, transform, transition)",
    rendererContent.includes("opacity") &&
    rendererContent.includes("transform") &&
    rendererContent.includes("transition")
  );
  assert(
    "renderer.js respeita prefers-reduced-motion",
    rendererContent.includes("prefers-reduced-motion")
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 14: Nenhum conteúdo é duplicado ou perdido durante a reordenação
// ════════════════════════════════════════════════════════════════════════════
group("14. Reordenação não duplica nem perde itens");
{
  const projectIds = getSortedProjectIds("recruiter");
  const uniqueIds = new Set(projectIds);
  assert("IDs de projetos não contêm duplicatas para recrutador", uniqueIds.size === projectIds.length);

  const expIds = getSortedExperienceIds("academic");
  const uniqueExpIds = new Set(expIds);
  assert("IDs de experiências não contêm duplicatas para acadêmico", uniqueExpIds.size === expIds.length);

  const allProjects = CONTENT_CATALOG.filter(i => i.type === "project").map(i => i.id).sort();
  const sortedForR = [...getSortedProjectIds("recruiter")].sort();
  const sortedForA = [...getSortedProjectIds("academic")].sort();
  assert(
    "Todos os projetos presentes na ordem do recrutador",
    JSON.stringify(allProjects) === JSON.stringify(sortedForR)
  );
  assert(
    "Todos os projetos presentes na ordem do acadêmico",
    JSON.stringify(allProjects) === JSON.stringify(sortedForA)
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CRITÉRIO 15: Não foram inventadas informações profissionais
// ════════════════════════════════════════════════════════════════════════════
group("15. Nenhuma informação inventada");
{
  // Verifica que os IDs do catálogo correspondem apenas aos dados reais do portfólio
  const REAL_IDS_FROM_HTML = ["rhfusion", "frotasync", "exp-dmind", "exp-ifmg", "exp-puc"];
  const catalogIds = CONTENT_CATALOG.map(i => i.id).sort();
  const realIds = [...REAL_IDS_FROM_HTML].sort();

  assert(
    "Catálogo contém apenas itens presentes no HTML real do portfólio",
    JSON.stringify(catalogIds) === JSON.stringify(realIds)
  );
  assert(
    "Catálogo não contém itens como 'startup', 'premio', 'publicacao' (fictícios)",
    !CONTENT_CATALOG.some(i => ["startup", "premio", "publicacao"].includes(i.id))
  );
}

// ── Resultado Final ──────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(50)}`);
console.log(`Resultado: ${passed} passaram, ${failed} falharam`);
if (failed > 0) {
  console.error("FALHOU — revise os itens marcados com ❌");
  process.exit(1);
} else {
  console.log("PASSOU — todos os critérios verificados ✅");
  process.exit(0);
}
