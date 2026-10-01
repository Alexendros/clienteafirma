/**
 * Autofirma-2026 Portal — Interactividad
 * Funciones: test de protocolo, copia de checksums, toast notifications
 */

(function () {
  'use strict';

  // ========================================
  // UTILIDADES
  // ========================================
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const createElement = (tag, props = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([k, v]) => el.dataset[k] = v);
      } else if (key === 'classList') {
        value.forEach(c => el.classList.add(c));
      } else {
        el[key] = value;
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });
    return el;
  };

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================
  let toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = createElement('div', { className: 'toast-container' });
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, type = 'info', duration = 3000) {
    const container = getToastContainer();
    const toast = createElement('div', {
      className: `toast toast-${type}`,
      role: 'alert',
      ariaLive: 'polite'
    }, [
      createElement('span', {}, message)
    ]);

    container.appendChild(toast);

    // Auto-remove
    setTimeout(() => {
      toast.classList.add('removing');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);

    return toast;
  }

  // ========================================
  // COPY TO CLIPBOARD
  // ========================================
  async function copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      if (button) {
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;
        button.title = 'Copiado';
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = originalHTML;
          button.title = 'Copiar checksum';
        }, 2000);
      }
      showToast('Checksum copiado al portapapeles', 'success');
      return true;
    } catch (err) {
      console.error('Error copiando:', err);
      showToast('Error al copiar: ' + err.message, 'error');
      return false;
    }
  }

  // ========================================
  // PROTOCOL TEST
  // ========================================
  function initProtocolTest() {
    const btn = $('#launch');
    const status = $('#status');

    if (!btn || !status) return;

    btn.addEventListener('click', async () => {
      const url = 'afirma://';
      status.textContent = 'Invocando ' + url + ' …';
      status.className = 'protocol-test-status loading';

      try {
        window.location.href = url;
        // Nota: no podemos detectar si se abrió realmente
        // Mostramos éxito después de un breve delay
        setTimeout(() => {
          status.textContent = 'Intento de apertura enviado. Si Autofirma no se abre, verifica la asociación de protocolo en tu sistema.';
          status.className = 'protocol-test-status success';
        }, 1500);
      } catch (err) {
        status.textContent = 'Error: ' + err.message;
        status.className = 'protocol-test-status error';
      }
    });
  }

  // ========================================
  // CHECKSUM COPY BUTTONS
  // ========================================
  function initChecksumCopy() {
    $$('.checksum').forEach(container => {
      const valueEl = container.querySelector('.checksum-value');
      if (valueEl) {
        const checksum = valueEl.textContent.trim();
        if (checksum && !checksum.startsWith('pendiente')) {
          // Crear botón de copia si no existe
          if (!container.querySelector('.checksum-copy')) {
            const copyBtn = createElement('button', {
              className: 'checksum-copy',
              title: 'Copiar checksum',
              ariaLabel: 'Copiar checksum SHA256 al portapapeles',
              type: 'button'
            }, [
              createElement('svg', {
                width: 16,
                height: 16,
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                strokeWidth: 2,
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                ariaHidden: 'true'
              }, [
                createElement('rect', { x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2 }),
                createElement('path', { d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' })
              ])
            ]);

            copyBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              copyToClipboard(checksum, copyBtn);
            });

            container.style.position = 'relative';
            container.appendChild(copyBtn);
          }
        }
      }
    });
  }

  // ========================================
  // SMOOTH SCROLL PARA ANCHORS
  // ========================================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId !== '#') {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.focus({ preventScroll: true });
          }
        }
      });
    });
  }

  // ========================================
  // KEYBOARD NAVIGATION ENHANCEMENTS
  // ========================================
  function initKeyboardNav() {
    // Asegurar que elementos interactivos tengan focus visible
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    // Escape para cerrar modales/toasts futuros
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        $$('.toast').forEach(toast => {
          toast.classList.add('removing');
          toast.addEventListener('animationend', () => toast.remove());
        });
      }
    });
  }

  // ========================================
  // INICIALIZACIÓN
  // ========================================
  function init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initProtocolTest();
    initChecksumCopy();
    initSmoothScroll();
    initKeyboardNav();

    // Añadir skip link si no existe
    if (!$('#skip-link')) {
      const skipLink = createElement('a', {
        id: 'skip-link',
        className: 'skip-link',
        href: '#main-content'
      }, 'Saltar al contenido principal');
      document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Marcar main content
    const main = $('main') || $('.container') || $('body');
    if (main && !main.id) {
      main.id = 'main-content';
    }

    console.log('[Autofirma Portal] Inicializado ✓');
  }

  init();

  // Exponer API pública para debugging
  window.AutofirmaPortal = {
    showToast,
    copyToClipboard
  };
})();