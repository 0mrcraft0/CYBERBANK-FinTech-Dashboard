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
