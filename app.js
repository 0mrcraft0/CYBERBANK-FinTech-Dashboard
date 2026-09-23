const navItems = document.querySelectorAll('[data-view]');
const views = document.querySelectorAll('.content-view');
const pageTitle = document.querySelector('#page-title');
const pageKicker = document.querySelector('#page-kicker');
const titles = {
  dashboard: ['Overview', 'Dashboard'],
  markets: ['Explore', 'Markets'],
  portfolio: ['Your money', 'Portfolio'],
  transactions: ['Money movement', 'Transactions'],
  security: ['Account protection', 'Security']
};

function showView(viewName) {
  const selectedTitle = titles[viewName] || titles.dashboard;
  views.forEach((view) => view.classList.toggle('active-view', view.id === `${viewName}-view`));
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === viewName));
  pageKicker.textContent = selectedTitle[0];
  pageTitle.textContent = selectedTitle[1];
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach((item) => item.addEventListener('click', () => showView(item.dataset.view)));

document.querySelectorAll('.period').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.period').forEach((period) => period.classList.remove('active'));
    button.classList.add('active');
    const values = { '1D': '$84,230.56', '1W': '$83,418.12', '1M': '$81,906.40', '3M': '$77,842.18', '1Y': '$68,230.44', ALL: '$54,120.15' };
    document.querySelector('#chart-value').textContent = values[button.dataset.period];
  });
});

document.querySelectorAll('.market-tab').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.market-tab').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');
    showToast(`${button.textContent} filter applied`);
  });
});

document.querySelectorAll('.order-side').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.order-side').forEach((side) => side.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('.trade-link').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('#trade-asset').value = button.dataset.trade;
    document.querySelector('.trade-drawer').scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`${button.dataset.trade} selected for paper trading`);
  });
});

document.querySelector('#place-order').addEventListener('click', () => {
  const asset = document.querySelector('#trade-asset').value;
  const amount = document.querySelector('#trade-amount').value;
  const side = document.querySelector('.order-side.active').textContent;
  if (!amount || Number(amount) <= 0) {
    showToast('Enter an amount to place an order');
    return;
  }
  showToast(`${side} order for ${amount} ${asset.split(' ')[0]} placed`);
  const available = document.querySelector('#available-balance');
  available.textContent = '$20,880.00';
});

document.querySelector('#deposit-button').addEventListener('click', () => showToast('Demo deposit added: +$5,000.00'));
document.querySelector('#export-button').addEventListener('click', () => showToast('CSV export prepared'));

document.querySelectorAll('.toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('on');
    showToast(toggle.classList.contains('on') ? 'Security control enabled' : 'Security control disabled');
  });
});

function showToast(message) {
  const toast = document.querySelector('#toast');
  document.querySelector('#toast-message').textContent = message;
  toast.classList.add('show');
  window.clearTimeout(window.toastTimer);
  window.toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

(() => {
  const protect = (event) => {
    const isModifier = event.ctrlKey || event.metaKey || event.altKey;
    const key = typeof event.key === 'string' ? event.key.toLowerCase() : '';

    if (['contextmenu', 'copy', 'cut', 'paste', 'dragstart', 'selectstart'].includes(event.type)) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    if (
      event.key === 'F12' ||
      (event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
      (isModifier && ['c', 'x', 'v', 's', 'p', 'u', 'a', 'i', 'j', 'l', 'm'].includes(key))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }

    return true;
  };

  const styleTag = document.createElement('style');
  styleTag.id = 'anti-copy-protect';
  styleTag.textContent = `
    html, body, * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    img, canvas, svg, video, iframe {
      -webkit-user-drag: none !important;
      pointer-events: auto;
    }
  `;
  if (!document.getElementById('anti-copy-protect')) {
    document.head.appendChild(styleTag);
  }

  ['contextmenu', 'copy', 'cut', 'paste', 'dragstart', 'selectstart'].forEach((type) => {
    document.addEventListener(type, protect, { capture: true, passive: false });
  });
  document.addEventListener('keydown', protect, { capture: true, passive: false });

  const detectDevTools = () => {
    const widthLeak = window.outerWidth - window.innerWidth;
    const heightLeak = window.outerHeight - window.innerHeight;
    if ((widthLeak > 150 || heightLeak > 150) && !document.body.dataset.protectionFlag) {
      document.body.dataset.protectionFlag = '1';
      document.body.style.filter = 'saturate(0.9)';
    }
  };

  window.addEventListener('resize', detectDevTools);
  setInterval(detectDevTools, 1200);
})();

(() => {
  const head = document.head || document.querySelector('head');
  const metaConfig = [
    ['http-equiv', 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0'],
    ['http-equiv', 'Pragma', 'no-cache'],
    ['http-equiv', 'Expires', '0'],
    ['name', 'robots', 'noindex, nofollow, noarchive'],
    ['name', 'referrer', 'no-referrer']
  ];

  metaConfig.forEach(([attr, key, value]) => {
    const selector = `meta[${attr}="${key}"]`;
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attr, key);
      head.appendChild(tag);
    }
    tag.setAttribute('content', value);
  });

  const styleTag = document.createElement('style');
  styleTag.id = 'anti-copy-extended';
  styleTag.textContent = `
    body::before {
      content: 'CONFIDENTIAL';
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      z-index: 2147483646;
      font-size: min(10vw, 120px);
      font-weight: 800;
      letter-spacing: 0.2em;
      color: rgba(255,255,255,0.06);
      pointer-events: none;
      transform: rotate(-18deg);
      user-select: none;
      white-space: nowrap;
      text-transform: uppercase;
    }
    img, svg, canvas, video, picture, source, iframe, embed, object {
      user-select: none !important;
      -webkit-user-select: none !important;
      -webkit-user-drag: none !important;
      drag: none !important;
      pointer-events: none !important;
      max-width: 100%;
    }
    img, svg, canvas, video {
      filter: saturate(0.95) contrast(1.02);
    }
  `;
  if (!document.getElementById('anti-copy-extended')) {
    document.head.appendChild(styleTag);
  }

  document.querySelectorAll('img, svg, canvas, video, picture, source, iframe, embed, object').forEach((node) => {
    node.setAttribute('draggable', 'false');
    node.setAttribute('loading', 'eager');
  });

  const stopMedia = (event) => {
    if (event.target && ['IMG', 'SVG', 'CANVAS', 'VIDEO', 'PICTURE', 'SOURCE', 'IFRAME', 'EMBED', 'OBJECT'].includes(event.target.tagName)) {
      event.preventDefault();
      return false;
    }
    return true;
  };

  document.addEventListener('dragstart', stopMedia, { capture: true, passive: false });
  document.addEventListener('mousedown', stopMedia, { capture: true, passive: false });
})();
