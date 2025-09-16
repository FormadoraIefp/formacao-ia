/* ==============================================
   JAVASCRIPT BOTÕES FLUTUANTES - IEFP SESSÕES
   ============================================== */

/**
 * Função para scroll suave para o topo da página
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Função para imprimir página completa
 */
function printPage() {
  // Opcional: Ocultar elementos específicos antes de imprimir
  const elementsToHide = document.querySelectorAll('.floating-buttons, .btn-floating');
  elementsToHide.forEach(el => el.style.display = 'none');
  
  // Imprimir
  window.print();
  
  // Restaurar elementos após impressão
  setTimeout(() => {
    elementsToHide.forEach(el => el.style.display = '');
  }, 100);
}

/**
 * Função para voltar à sessão anterior
 * PERSONALIZAR: Alterar URLs conforme estrutura dos ficheiros
 */
function voltarSessaoAnterior() {
  if (confirm("Pretende voltar à sessão anterior? O progresso nesta página será mantido.")) {
    // OPÇÃO 1: Redirecionamento direto (personalizar URL)
    window.location.href = "sessao2_01.html";
    
    // OPÇÃO 2: Redirecionamento com base no nome da página atual
    // const currentPage = window.location.pathname.split('/').pop();
    // if (currentPage.includes('recursos')) {
    //   window.location.href = "sessao2_01.html";
    // } else if (currentPage.includes('2-2')) {
    //   window.location.href = "sessao2_01.html";
    // }
    
    // OPÇÃO 3: Para desenvolvimento/teste (remover em produção)
    // alert("Redirecionando para sessão anterior...\n\nEm produção, voltaria ao documento principal.");
  }
}

/**
 * Controle de visibilidade dos botões com base no scroll
 */
function initFloatingButtons() {
  const floatingButtons = document.querySelector('.floating-buttons');
  
  if (!floatingButtons) {
    console.warn('Floating buttons container não encontrado');
    return;
  }

  // Função para atualizar visibilidade
  function updateButtonsVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Mostrar botões após scroll de 300px ou 20% da página
    const showThreshold = Math.min(300, documentHeight * 0.2);
    
    if (scrollTop > showThreshold) {
      floatingButtons.classList.remove('hidden');
      floatingButtons.classList.add('visible');
      floatingButtons.style.opacity = '1';
      floatingButtons.style.transform = 'translateX(0)';
    } else {
      floatingButtons.classList.add('hidden');
      floatingButtons.classList.remove('visible');
      floatingButtons.style.opacity = '0.7';
      floatingButtons.style.transform = 'translateX(10px)';
    }
  }

  // Listener para scroll com throttling para performance
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateButtonsVisibility, 10);
  });

  // Inicializar estado
  updateButtonsVisibility();
}

/**
 * Indicador de progresso do scroll (opcional)
 */
function initScrollIndicator() {
  const indicator = document.querySelector('.scroll-indicator');
  
  if (!indicator) return;

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const totalScroll = documentHeight - windowHeight;
    
    const progress = Math.min((scrollTop / totalScroll) * 100, 100);
    indicator.style.setProperty('--scroll-progress', `${progress}%`);
  }

  let scrollTimeout;
  window.addEventListener('scroll', function() {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateScrollProgress, 10);
  });

  updateScrollProgress();
}

/**
 * Função para adicionar tooltips customizados (alternativa ao title)
 */
function initCustomTooltips() {
  const buttonsWithTooltips = document.querySelectorAll('.btn-floating[data-tooltip]');
  
  buttonsWithTooltips.forEach(button => {
    button.addEventListener('mouseenter', function() {
      // Tooltip já é criado via CSS :before
    });
    
    button.addEventListener('mouseleave', function() {
      // Cleanup se necessário
    });
  });
}

/**
 * Função para detectar se é mobile e ajustar comportamentos
 */
function isMobile() {
  return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Ajustar comportamentos para mobile
 */
function initMobileBehaviors() {
  if (isMobile()) {
    // Reduzir efeitos de hover em mobile
    const floatingButtons = document.querySelectorAll('.btn-floating');
    floatingButtons.forEach(button => {
      button.addEventListener('touchstart', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
      });
      
      button.addEventListener('touchend', function() {
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
      });
    });
    
    // Ajustar posição se necessário em paisagem
    window.addEventListener('orientationchange', function() {
      setTimeout(() => {
        const floatingButtons = document.querySelector('.floating-buttons');
        if (floatingButtons && window.orientation && Math.abs(window.orientation) === 90) {
          floatingButtons.style.bottom = '15px';
          floatingButtons.style.right = '15px';
        } else if (floatingButtons) {
          floatingButtons.style.bottom = '20px';
          floatingButtons.style.right = '20px';
        }
      }, 100);
    });
  }
}

/**
 * Função para adicionar animações de entrada
 */
function initEntranceAnimations() {
  const floatingButtons = document.querySelector('.floating-buttons');
  
  if (floatingButtons) {
    // Adicionar classe de animação após um pequeno delay
    setTimeout(() => {
      floatingButtons.classList.add('animate-in');
    }, 500);
  }
}

/**
 * Função para configurar teclas de atalho (opcional)
 */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Seta para cima = Voltar ao topo
    if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowUp') {
      event.preventDefault();
      scrollToTop();
    }
    
    // Ctrl/Cmd + P = Imprimir (se botão existir)
    if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
      const printButton = document.querySelector('.btn-print');
      if (printButton) {
        // Deixar comportamento padrão do browser
        // event.preventDefault();
        // printPage();
      }
    }
    
    // Escape = Voltar (se botão existir)
    if (event.key === 'Escape') {
      const backButton = document.querySelector('.btn-back');
      if (backButton && !document.querySelector(':focus')) {
        voltarSessaoAnterior();
      }
    }
  });
}

/**
 * Função principal de inicialização
 */
function initFloatingButtonsSystem() {
  // Inicializar sistema básico
  initFloatingButtons();
  
  // Funcionalidades opcionais
  initScrollIndicator();
  initCustomTooltips();
  initMobileBehaviors();
  initEntranceAnimations();
  initKeyboardShortcuts();
  
  console.log('Sistema de botões flutuantes inicializado');
}

/**
 * Inicializar quando documento estiver pronto
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFloatingButtonsSystem);
} else {
  // DOM já está carregado
  initFloatingButtonsSystem();
}

/**
 * Backup para garantia (window.onload)
 */
window.addEventListener('load', function() {
  // Verificar se já foi inicializado
  if (!document.querySelector('.floating-buttons.visible, .floating-buttons.hidden')) {
    initFloatingButtonsSystem();
  }
});

/* ==============================================
   FUNÇÕES UTILITÁRIAS EXTRAS
   ============================================== */

/**
 * Função para alterar dinamicamente o destino do botão voltar
 */
function setBackButtonDestination(url) {
  const backButton = document.querySelector('.btn-back');
  if (backButton) {
    backButton.onclick = function() {
      if (confirm("Pretende voltar à página anterior?")) {
        window.location.href = url;
      }
    };
  }
}

/**
 * Função para ocultar/mostrar botões específicos
 */
function toggleFloatingButton(buttonClass, show = true) {
  const button = document.querySelector(`.${buttonClass}`);
  if (button) {
    button.style.display = show ? 'flex' : 'none';
  }
}

/**
 * Função para adicionar novos botões dinamicamente
 */
function addFloatingButton(config) {
  const container = document.querySelector('.floating-buttons');
  if (!container) return;
  
  const button = document.createElement('button');
  button.className = `btn-floating ${config.class || ''}`;
  button.innerHTML = config.icon || '<i class="fas fa-question"></i>';
  button.title = config.title || '';
  button.onclick = config.onClick || function() {};
  
  if (config.style) {
    Object.assign(button.style, config.style);
  }
  
  container.appendChild(button);
}

// Exemplo de uso das funções utilitárias:
// setBackButtonDestination('sessao1_03.html');
// toggleFloatingButton('btn-print', false);
// addFloatingButton({
//   class: 'btn-help',
//   icon: '<i class="fas fa-question-circle"></i>',
//   title: 'Ajuda',
//   onClick: () => alert('Ajuda!'),
//   style: { background: 'linear-gradient(135deg, #f59e0b, #d97706)' }
// });