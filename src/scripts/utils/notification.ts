import { t } from './i18n';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

export function showNotification(message: string, type: NotificationType = 'info') {
  const container = getNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span class="notification-icon">${getNotificationIcon(type)}</span>
    <span class="notification-message">${message}</span>
    <button class="notification-close">×</button>
  `;
  
  container.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn?.addEventListener('click', () => {
    closeNotification(notification);
  });
  
  setTimeout(() => {
    closeNotification(notification);
  }, 3000);
}

function closeNotification(notification: HTMLElement) {
  notification.classList.remove('show');
  setTimeout(() => {
    notification.remove();
  }, 300);
}

function getNotificationContainer(): HTMLElement {
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
  }
  return container;
}

function getNotificationIcon(type: NotificationType): string {
  switch (type) {
    case 'success':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    case 'error':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    case 'warning':
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    default:
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
  }
}

export function showError(errorKey: string) {
  showNotification(t(errorKey), 'error');
}

export function showSuccess(successKey: string) {
  showNotification(t(successKey), 'success');
}
