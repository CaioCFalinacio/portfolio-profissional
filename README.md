# Portfólio Profissional | Caio Falinacio

🔗 **[Acessar Portfólio Online](https://portfolio-profissional-hs.vercel.app/)**

Portfólio profissional desenvolvido para apresentar projetos, experiências e habilidades de forma dinâmica e personalizada. O projeto foi construído utilizando apenas **HTML, CSS e JavaScript Vanilla**, sem o uso de frameworks, focando em performance, acessibilidade e modularidade.

## ✨ Funcionalidades

*   🎯 **Personalização por Perfil:** Sistema inteligente que reorganiza a apresentação de projetos e experiências com base no perfil do visitante (Recrutador, Professor/Avaliador ou Visitante Geral), destacando as informações mais relevantes para cada público.
*   🌐 **Internacionalização (PT/EN):** Troca de idioma instantânea sem necessidade de recarregar a página.
*   📱 **Design Responsivo:** Interface fluida que se adapta perfeitamente a dispositivos móveis, tablets e desktops.
*   💾 **Persistência de Preferências:** O perfil escolhido pelo visitante é salvo localmente (`localStorage`), garantindo uma experiência contínua em visitas futuras.

## 🛠️ Tecnologias Utilizadas

*   **HTML5** (Semântico e Acessível)
*   **CSS3** (Variáveis, Flexbox, CSS Grid, Media Queries)
*   **JavaScript ES6+** (Módulos, Manipulação de DOM, localStorage, Observers)
*   **Lucide Icons** (Ícones SVG)

## 📁 Estrutura do Projeto

A arquitetura JavaScript foi desenhada de forma modular, com destaque especial para o sistema de perfis:

```text
/
├── index.html            # Estrutura principal
├── assets/
│   ├── css/
│   │   ├── style.css     # Estilos globais e responsividade
│   │   └── profile.css   # Estilos do sistema de perfis e modal
│   └── js/
│       ├── main.js       # Traduções (i18n), inicialização e efeitos de scroll
│       ├── profile.js    # Orquestrador do sistema de perfis
│       └── profile/      # Módulos do sistema de personalização
│           ├── config.js   # Catálogo de metadados e pesos dos projetos/experiências
│           ├── storage.js  # Gerenciamento de persistência local seguro
│           ├── sorter.js   # Lógica de ordenação (independente de DOM)
│           ├── renderer.js # Aplicação de mudanças no DOM sem duplicar elementos
│           ├── modal.js    # Componente acessível do modal (Focus Trap, teclado)
│           └── i18n.js     # Dicionário estendido para o sistema de perfis
```

## 🚀 Como rodar localmente

Como o projeto utiliza **Módulos JavaScript** (`<script type="module">`), ele precisa ser executado através de um servidor HTTP local devido às políticas de segurança dos navegadores (CORS).

1. Clone o repositório:
   ```bash
   git clone https://github.com/caiofalsantos/portfolio-profissional.git
   ```
2. Abra a pasta do projeto no VS Code.
3. Utilize a extensão **Live Server** (ou similar) e inicie o servidor na porta padrão.
4. O navegador abrirá automaticamente exibindo o portfólio.

## 👨‍💻 Autor

**Caio César Falinacio dos Santos**
Estudante de Engenharia de Software na PUC Minas & Desenvolvedor de Software.

*   [LinkedIn](https://www.linkedin.com/in/caio-falinacio-464b18357/)
*   [GitHub Pessoal](https://github.com/caiofalsantos)
*   [GitHub Acadêmico](https://github.com/CaioCFalinacio)

---
