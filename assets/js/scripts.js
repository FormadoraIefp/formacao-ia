/**
 * UFCD 0768 - Criação de Sites Web
 * Ficheiro JavaScript Principal
 * Funcionalidades comuns para todas as páginas
 */

// ============================================
// 1. CONFIGURAÇÃO INICIAL
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 UFCD 0768 - Site carregado com sucesso!");

  // Inicializar componentes
  initProgressBar();
  initBackToTop();
  initSmoothScroll();
  initTooltips();
  initSearchFilter();
  initAnimations();
  initAccessibility();
  initPrintButtons();
  initDarkMode();

  // Atualizar ano no rodapé
  updateFooterYear();
});

// ============================================
// 2. BARRA DE PROGRESSO
// ============================================

function initProgressBar() {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;

  window.addEventListener("scroll", function () {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });
}

// ============================================
// 3. BOTÃO VOLTAR AO TOPO
// ============================================

function initBackToTop() {
  // Tentar múltiplos seletores para o botão voltar ao topo
  const backToTopBtn =
    document.getElementById("backToTop") ||
    document.querySelector(".btn-top") ||
    document.querySelector(".btn-floating") ||
    document.querySelector('[data-action="back-to-top"]');

  if (!backToTopBtn) {
    console.warn(
      "Botão 'voltar ao topo' não encontrado. Seletores tentados: #backToTop, .btn-top, .btn-floating, [data-action='back-to-top']"
    );
    return;
  }

  // Mostrar/esconder botão baseado no scroll
  function toggleBackToTopVisibility() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
      backToTopBtn.style.display = "flex";
      backToTopBtn.style.opacity = "1";
    } else {
      backToTopBtn.classList.remove("show");
      backToTopBtn.style.opacity = "0.7";
    }
  }

  window.addEventListener("scroll", toggleBackToTopVisibility);

  // Scroll suave ao clicar
  backToTopBtn.addEventListener("click", function (e) {
    e.preventDefault();

    // Múltiplas opções de scroll para compatibilidade
    if (window.scrollTo) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Fallback para browsers mais antigos
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    console.log("Botão voltar ao topo clicado");
  });

  // Verificação inicial
  toggleBackToTopVisibility();
}

// ============================================
// 4. SCROLL SUAVE
// ============================================

function initSmoothScroll() {
  // Aplicar scroll suave a todos os links âncora
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerOffset = 80; // Altura da navbar fixa
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ============================================
// 5. TOOLTIPS BOOTSTRAP
// ============================================

function initTooltips() {
  // Inicializar todos os tooltips Bootstrap
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// ============================================
// 6. SISTEMA DE PESQUISA E FILTROS
// ============================================

function initSearchFilter() {
  const searchInput = document.getElementById("q");
  const filterButtons = document.querySelectorAll(".filter-pill");
  const sections = document.querySelectorAll("[data-tags]");

  if (!searchInput || !filterButtons.length) return;

  function applyFilters() {
    const searchTerm = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    const activeFilter = document.querySelector(".filter-pill.active");
    const filterValue = activeFilter ? activeFilter.dataset.filter : "all";

    sections.forEach((section) => {
      const tags = section.dataset.tags || "";
      const sectionText = section.textContent.toLowerCase();

      // Verificar filtro de categoria
      const categoryMatch = filterValue === "all" || tags.includes(filterValue);

      // Verificar pesquisa de texto
      const textMatch =
        !searchTerm ||
        sectionText.includes(searchTerm) ||
        tags.includes(searchTerm);

      // Mostrar/esconder secção
      const shouldShow = categoryMatch && textMatch;
      section.style.display = shouldShow ? "" : "none";

      // Auto-expandir se pesquisando
      if (searchTerm && shouldShow && section.querySelector(".collapse")) {
        const collapseElement = section.querySelector(".collapse");
        const bsCollapse = new bootstrap.Collapse(collapseElement, {
          show: true,
        });
      }
    });

    // Mostrar mensagem se não houver resultados
    const visibleSections = Array.from(sections).filter(
      (s) => s.style.display !== "none"
    );
    showNoResultsMessage(visibleSections.length === 0);
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener("input", debounce(applyFilters, 300));
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      applyFilters();
    });
  });

  // Aplicar filtros iniciais
  applyFilters();
}

// Mostrar mensagem quando não há resultados
function showNoResultsMessage(show) {
  let noResultsEl = document.getElementById("noResults");

  if (show && !noResultsEl) {
    const container =
      document.querySelector("#sections") || document.querySelector("main");
    if (container) {
      noResultsEl = document.createElement("div");
      noResultsEl.id = "noResults";
      noResultsEl.className = "alert alert-info text-center mt-4";
      noResultsEl.innerHTML = `
                <i class="bi bi-search me-2"></i>
                <strong>Nenhum resultado encontrado.</strong>
                <br>Tente ajustar os filtros ou termos de pesquisa.
            `;
      container.appendChild(noResultsEl);
    }
  } else if (!show && noResultsEl) {
    noResultsEl.remove();
  }
}

// ============================================
// 7. ANIMAÇÕES AO SCROLL
// ============================================

function initAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

// ============================================
// 8. ACESSIBILIDADE
// ============================================

function initAccessibility() {
  // Adicionar suporte para navegação por teclado
  handleKeyboardNavigation();

  // Gerir foco em modais
  handleModalFocus();

  // Adicionar anúncios ARIA para ações dinâmicas
  createAriaLiveRegion();
}

function handleKeyboardNavigation() {
  // Esc fecha dropdowns e modais
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      // Fechar dropdowns abertos
      const openDropdowns = document.querySelectorAll(".dropdown-menu.show");
      openDropdowns.forEach((dropdown) => {
        const dropdownToggle = dropdown.previousElementSibling;
        if (dropdownToggle) {
          bootstrap.Dropdown.getInstance(dropdownToggle).hide();
        }
      });

      // Fechar modais abertos
      const openModals = document.querySelectorAll(".modal.show");
      openModals.forEach((modal) => {
        bootstrap.Modal.getInstance(modal).hide();
      });
    }
  });
}

function handleModalFocus() {
  // Manter foco dentro do modal quando aberto
  document.addEventListener("shown.bs.modal", function (e) {
    const modal = e.target;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length) {
      focusableElements[0].focus();
    }
  });
}

function createAriaLiveRegion() {
  // Criar região para anúncios de acessibilidade
  if (!document.getElementById("ariaLive")) {
    const ariaLive = document.createElement("div");
    ariaLive.id = "ariaLive";
    ariaLive.setAttribute("aria-live", "polite");
    ariaLive.setAttribute("aria-atomic", "true");
    ariaLive.className = "visually-hidden";
    document.body.appendChild(ariaLive);
  }
}

// ============================================
// 9. FUNÇÕES UTILITÁRIAS
// ============================================

// Debounce para otimizar performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Copiar código para clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Código copiado!", "success");
      })
      .catch((err) => {
        showToast("Erro ao copiar código", "danger");
      });
  } else {
    // Fallback para browsers antigos
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    showToast("Código copiado!", "success");
  }
}

// Mostrar notificação toast
function showToast(message, type = "info") {
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

  toastContainer.appendChild(toast);
  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // Remover após esconder
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toastContainer";
  container.className = "toast-container position-fixed bottom-0 end-0 p-3";
  container.style.zIndex = "1070";
  document.body.appendChild(container);
  return container;
}

// ============================================
// 10. TEMA ESCURO (Dark Mode)
// ============================================

function initDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (!darkModeToggle) return;

  // Verificar preferência guardada ou do sistema
  const currentTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  document.documentElement.setAttribute("data-theme", currentTheme);
  updateDarkModeToggle(currentTheme === "dark");

  darkModeToggle.addEventListener("click", function () {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateDarkModeToggle(!isDark);
  });
}

function updateDarkModeToggle(isDark) {
  const icon = document.querySelector("#darkModeToggle i");
  if (icon) {
    icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-fill";
  }
}

// ============================================
// 11. SISTEMA DE IMPRESSÃO
// ============================================

function initPrintButtons() {
  // Adicionar event listeners a todos os botões de impressão
  document.addEventListener("click", function (e) {
    if (
      e.target.matches('[data-print="page"]') ||
      e.target.closest('[data-print="page"]')
    ) {
      e.preventDefault();
      printCurrentPage();
    }

    if (
      e.target.matches('[onclick*="printPage"]') ||
      e.target.closest('[onclick*="printPage"]')
    ) {
      e.preventDefault();
      printCurrentPage();
    }
  });
}

function printCurrentPage(options = {}) {
  const defaultOptions = {
    title: document.title + " - Versão para Impressão",
    includeStyles: true,
    includeBootstrap: true,
    selector: "main",
    showPrintHeader: true,
    customCSS: "",
  };

  const config = { ...defaultOptions, ...options };

  // Criar nova janela para impressão
  const printWindow = window.open("", "_blank");

  // Verificar se a nova janela foi aberta corretamente
  if (!printWindow) {
    showToast(
      "Não foi possível abrir a janela de impressão. Verifique as configurações do navegador.",
      "danger"
    );
    return;
  }

  try {
    // Obter o conteúdo a imprimir
    const contentElement = document.querySelector(config.selector);
    if (!contentElement) {
      showToast("Conteúdo para impressão não encontrado.", "danger");
      printWindow.close();
      return;
    }

    const content = contentElement.innerHTML;

    // Copiar estilos inline se solicitado
    let styles = "";
    if (config.includeStyles) {
      styles = Array.from(document.querySelectorAll("style"))
        .map((style) => style.innerHTML)
        .join("\n");
    }

    // Criar HTML para impressão
    const printHTML = `
            <!DOCTYPE html>
            <html lang="pt">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${config.title}</title>
                ${
                  config.includeBootstrap
                    ? '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">'
                    : ""
                }
                <style>
                    ${styles}
                    ${getPrintStyles(config.showPrintHeader)}
                    ${config.customCSS}
                </style>
            </head>
            <body>
                ${config.showPrintHeader ? getPrintHeader() : ""}
                <div class="print-content">
                    ${content}
                </div>
            </body>
            </html>
        `;

    // Escrever o conteúdo na nova janela
    printWindow.document.write(printHTML);
    printWindow.document.close();

    // Aguardar carregamento e focar na janela
    printWindow.onload = function () {
      printWindow.focus();
    };

    showToast("Janela de impressão aberta com sucesso!", "success");
  } catch (error) {
    console.error("Erro ao criar versão para impressão:", error);
    showToast("Erro ao preparar conteúdo para impressão.", "danger");
    printWindow.close();
  }
}

function getPrintHeader() {
  return `
        <div class="print-header no-print-when-printing">
            <div class="d-flex justify-content-center align-items-center gap-3">
                <button onclick="window.print()" class="btn btn-primary">
                    <i class="bi bi-printer"></i> Imprimir
                </button>
                <button onclick="window.close()" class="btn btn-secondary">
                    <i class="bi bi-x-circle"></i> Fechar
                </button>
            </div>
        </div>
    `;
}

function getPrintStyles(showHeader = true) {
  return `
        /* Estilos para visualização de impressão */
        .print-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            padding: 1rem;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .print-content {
            ${showHeader ? "padding-top: 80px;" : ""}
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .no-print {
            display: none !important;
        }
        
        /* Estilos para impressão real */
        @media print {
            .no-print-when-printing,
            .print-header {
                display: none !important;
            }
            
            .print-content {
                padding-top: 0 !important;
                padding: 0 !important;
                max-width: none !important;
            }
            
            body {
                margin: 0;
                padding: 0;
                background: white !important;
                color: black !important;
                font-size: 12pt;
                line-height: 1.3;
            }
            
            .card {
                border: 1px solid #000 !important;
                box-shadow: none !important;
                page-break-inside: avoid;
                margin-bottom: 1rem;
            }
            
            .card-header {
                background: #f5f5f5 !important;
                border-bottom: 1px solid #000 !important;
            }
            
            h1, h2, h3, h4, h5, h6 {
                color: #000 !important;
                -webkit-text-fill-color: #000 !important;
                page-break-after: avoid;
            }
            
            p, li, td, th {
                color: #000 !important;
                -webkit-text-fill-color: #000 !important;
            }
            
            a {
                color: #000 !important;
                text-decoration: underline;
            }
            
            .btn {
                border: 1px solid #000;
                background: transparent !important;
                color: #000 !important;
            }
            
            @page {
                size: A4;
                margin: 2cm;
            }
            
            /* Evitar quebras de página indesejadas */
            .tutorial-card,
            .section-card,
            .alert,
            .table {
                page-break-inside: avoid;
            }
            
            /* Melhorar legibilidade de tabelas */
            table {
                border-collapse: collapse;
                width: 100%;
            }
            
            th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            
            th {
                background-color: #f0f0f0 !important;
                font-weight: bold;
            }
        }
        
        /* Estilos para dispositivos móveis na visualização */
        @media (max-width: 768px) {
            .print-content {
                padding: 15px;
            }
            
            .print-header .btn {
                font-size: 0.9rem;
                padding: 0.4rem 0.8rem;
            }
        }
    `;
}

// Função pública para impressão customizada
function printSection(selector, options = {}) {
  const element = document.querySelector(selector);
  if (!element) {
    showToast(`Elemento "${selector}" não encontrado.`, "danger");
    return;
  }

  printCurrentPage({
    selector: selector,
    title: options.title || `${document.title} - ${element.tagName}`,
    ...options,
  });
}

// Função para imprimir apenas texto sem formatação
function printPlainText(content, title = "Documento") {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    showToast("Não foi possível abrir a janela de impressão.", "danger");
    return;
  }

  const html = `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body {
                    font-family: 'Times New Roman', serif;
                    margin: 2cm;
                    line-height: 1.6;
                    color: #000;
                }
                .print-header {
                    text-align: center;
                    padding: 1rem;
                    border-bottom: 1px solid #ccc;
                    margin-bottom: 2rem;
                }
                @media print {
                    .print-header { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-header">
                <button onclick="window.print()">Imprimir</button>
                <button onclick="window.close()">Fechar</button>
            </div>
            <pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>
        </body>
        </html>
    `;

  printWindow.document.write(html);
  printWindow.document.close();
}

// ============================================
// 12. ANALYTICS (Opcional)
// ============================================

function trackEvent(category, action, label) {
  // Implementar tracking se necessário
  // Google Analytics, Matomo, etc.
  console.log(`📊 Event: ${category} - ${action} - ${label}`);
}

// ============================================
// 13. FUNCIONALIDADES ESPECÍFICAS DA PÁGINA
// ============================================

// Handle "coming soon" links
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("soon") || e.target.closest(".soon")) {
    e.preventDefault();
    const target = e.target.classList.contains("soon")
      ? e.target
      : e.target.closest(".soon");

    // Visual feedback
    target.style.transform = "scale(0.95)";
    setTimeout(() => {
      target.style.transform = "";
    }, 150);
  }
});

// Tracking de cliques em links externos
document.addEventListener("click", function (e) {
  const link = e.target.closest('a[href^="http"]');
  if (link && !link.href.includes(window.location.hostname)) {
    trackEvent("Outbound Link", "click", link.href);
  }
});

// Atualizar ano no rodapé
function updateFooterYear() {
  const anoElement = document.getElementById("ano");
  if (anoElement) {
    anoElement.textContent = new Date().getFullYear();
  }
}

// ============================================
// 14. EXPORTAR FUNÇÕES GLOBAIS
// ============================================

// Tornar funções disponíveis globalmente
window.UFCDUtils = {
  copyToClipboard,
  showToast,
  debounce,
  initDarkMode,
  printCurrentPage,
  printSection,
  printPlainText,
  trackEvent,
};
// Progress bar baseado no scroll (mantido do original)
window.addEventListener("scroll", function () {
  const winScroll =
    document.body.scrollTop || document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("progressBar").style.width = scrolled + "%";
});

// Toggle checkboxes
function toggleCheck(element) {
  element.classList.toggle("checked");
  if (element.classList.contains("checked")) {
    element.innerHTML = '<i class="fas fa-check"></i>';
  } else {
    element.innerHTML = "";
  }
  updateProgress();
}

// Atualizar progresso
function updateProgress() {
  const totalChecks = document.querySelectorAll(".checklist-checkbox").length;
  const checkedItems = document.querySelectorAll(
    ".checklist-checkbox.checked"
  ).length;
  const percentage = Math.round((checkedItems / totalChecks) * 100);

  const counter = document.getElementById("resultsCounter");
  counter.textContent = `Progresso: ${checkedItems}/${totalChecks} itens completos (${percentage}%)`;
}

// Finalizar sessão
function finalizarSessao() {
  const checkedItems = document.querySelectorAll(
    ".checklist-checkbox.checked"
  ).length;
  const totalChecks = document.querySelectorAll(".checklist-checkbox").length;
  const compromisso = document.querySelector(
    'input[name="compromisso"]:checked'
  );

  if (checkedItems >= totalChecks * 0.8 && compromisso) {
    alert(
      "Parabéns! Completou a Sessão 1.1 com sucesso.\n\nPrincipais aprendizagens:\n• Conceitos fundamentais de IA\n• Diferença entre IA e automação\n• Tipos de IA na educação\n• Visão equilibrada de benefícios/limitações\n\nEstá preparado para a Sessão 1.2: Criação e Adaptação de Materiais Pedagógicos!"
    );
    localStorage.setItem("sessao11_completada", new Date().toISOString());
  } else {
    let msg = "Para finalizar a sessão:\n";
    if (checkedItems < totalChecks * 0.8) {
      msg += `• Complete pelo menos ${Math.ceil(
        totalChecks * 0.8
      )} das ${totalChecks} atividades\n`;
    }
    if (!compromisso) {
      msg += "• Selecione um compromisso para a próxima sessão\n";
    }
    alert(msg);
  }
}

// Voltar ao topo (mantido do original)
function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Pesquisa (adaptado do original)
document.getElementById("searchInput").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const steps = document.querySelectorAll(".tutorial-step");

  steps.forEach((step) => {
    const content = step.textContent.toLowerCase();
    step.style.display =
      content.includes(searchTerm) || !searchTerm ? "block" : "none";
  });
});

// Inicializar
updateProgress();

// Verificar se já foi completada
if (localStorage.getItem("sessao11_completada")) {
  document.getElementById("resultsCounter").innerHTML =
    '<i class="fas fa-check-circle text-success me-2"></i>Sessão 1.1 completada em ' +
    new Date(localStorage.getItem("sessao11_completada")).toLocaleDateString(
      "pt-PT"
    );
}
