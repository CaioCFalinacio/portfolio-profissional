/**
 * main.js - Portfólio Profissional
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicialização dos Ícones Lucide
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 2. Sistema de Dicionário e Alternância de Idioma (PT / EN)
  const dictionary = {
    pt: {
      navSobre: "Sobre Mim",
      navProjetos: "Projetos",
      navExperiencias: "Experiências",
      navContato: "Contato",
      heroTitle: 'Olá, eu sou <span class="highlight">Seu Nome</span>',
      heroSubtitle: "Desenvolvedor(a) de Software",
      heroBio:
        "Estudante de Engenharia de Software na PUC Minas. Apaixonado(a) por desenvolvimento web, arquitetura de sistemas e solução de problemas através da tecnologia.",
      btnContact: "Fale Comigo",
      btnProjects: "Ver Projetos",
      titleProjects: "Projetos",
      titleExp: "Experiências",
      titleContact: "Contato",
      contactHeadline: "Vamos conversar!",
      contactSub:
        "Entre em contato pelas redes sociais ou envie uma mensagem diretamente.",
      labelName: "Nome",
      labelEmail: "E-mail",
      labelMessage: "Mensagem",
      btnSubmit: "Enviar Mensagem",
      phName: "Seu nome",
      phEmail: "seu.email@exemplo.com",
      phMessage: "Digite sua mensagem...",
    },
    en: {
      navSobre: "About Me",
      navProjetos: "Projects",
      navExperiencias: "Experience",
      navContato: "Contact",
      heroTitle: 'Hello, I am <span class="highlight">Your Name</span>',
      heroSubtitle: "Software Developer",
      heroBio:
        "Software Engineering student at PUC Minas. Passionate about web development, system architecture, and solving complex problems through technology.",
      btnContact: "Get in Touch",
      btnProjects: "View Projects",
      titleProjects: "Projects",
      titleExp: "Experience",
      titleContact: "Contact",
      contactHeadline: "Let's talk!",
      contactSub: "Reach out via social media or send a direct message below.",
      labelName: "Name",
      labelEmail: "Email",
      labelMessage: "Message",
      btnSubmit: "Send Message",
      phName: "Your name",
      phEmail: "your.email@example.com",
      phMessage: "Type your message...",
    },
  };

  const btnPt = document.getElementById("lang-pt");
  const btnEn = document.getElementById("lang-en");

  function changeLanguage(lang) {
    const t = dictionary[lang];
    if (!t) return;

    // Atualizar estado ativo dos botões
    btnPt.classList.toggle("active", lang === "pt");
    btnEn.classList.toggle("active", lang === "en");

    // Atualizar Navegação
    const navLinks = document.querySelectorAll(".nav-menu a");
    if (navLinks.length >= 4) {
      navLinks[0].textContent = t.navSobre;
      navLinks[1].textContent = t.navProjetos;
      navLinks[2].textContent = t.navExperiencias;
      navLinks[3].textContent = t.navContato;
    }

    // Hero Section
    const heroH1 = document.querySelector(".hero-text h1");
    const heroH2 = document.querySelector(".hero-text h2");
    const heroBio = document.getElementById("bio-text");
    const btnPrimary = document.querySelector(".hero-buttons .btn-primary");
    const btnSecondary = document.querySelector(".hero-buttons .btn-secondary");

    if (heroH1) heroH1.innerHTML = t.heroTitle;
    if (heroH2) heroH2.textContent = t.heroSubtitle;
    if (heroBio) heroBio.textContent = t.heroBio;
    if (btnPrimary) btnPrimary.textContent = t.btnContact;
    if (btnSecondary) btnSecondary.textContent = t.btnProjects;

    // Títulos de Seção
    const sectionTitles = document.querySelectorAll(".section-title");
    if (sectionTitles.length >= 3) {
      sectionTitles[0].textContent = t.titleProjects;
      sectionTitles[1].textContent = t.titleExp;
      sectionTitles[2].textContent = t.titleContact;
    }

    // Formulário e Contato
    const contactHeadline = document.querySelector(".contact-info h3");
    const contactSub = document.querySelector(".contact-info p");
    const labelName = document.querySelector('label[for="name"]');
    const labelEmail = document.querySelector('label[for="email"]');
    const labelMessage = document.querySelector('label[for="message"]');
    const inputName = document.getElementById("name");
    const inputEmail = document.getElementById("email");
    const inputMessage = document.getElementById("message");
    const btnSubmit = document.querySelector(
      '.contact-form button[type="submit"]',
    );

    if (contactHeadline) contactHeadline.textContent = t.contactHeadline;
    if (contactSub) contactSub.textContent = t.contactSub;
    if (labelName) labelName.textContent = t.labelName;
    if (labelEmail) labelEmail.textContent = t.labelEmail;
    if (labelMessage) labelMessage.textContent = t.labelMessage;
    if (inputName) inputName.placeholder = t.phName;
    if (inputEmail) inputEmail.placeholder = t.phEmail;
    if (inputMessage) inputMessage.placeholder = t.phMessage;
    if (btnSubmit) btnSubmit.textContent = t.btnSubmit;
  }

  btnPt.addEventListener("click", () => changeLanguage("pt"));
  btnEn.addEventListener("click", () => changeLanguage("en"));

  // 3. Highlight Dinâmico de Link Ativo durante o Scroll
  const sections = document.querySelectorAll("section[id]");
  const navMenuLinks = document.querySelectorAll(".nav-menu a");

  function highlightNavOnScroll() {
    const scrollY = window.scrollY;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navMenuLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavOnScroll);

  // 4. Manipulação do Formulário de Contato
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Feedback visual de envio
      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      setTimeout(() => {
        alert(
          `Obrigado pelo contato, ${name}! Sua mensagem foi enviada com sucesso.`,
        );
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1200);
    });
  }

  // 5. Animação Suave de Entrada (Fade-in nas seções)
  const observerOptions = {
    threshold: 0.15,
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".timeline-item, .card, .contact-wrapper",
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    revealObserver.observe(el);
  });
});
