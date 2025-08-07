type ToastType = 'success' | 'error' | 'warning' | 'info';

export const showToast = (message: string, type: ToastType = 'info') => {
  // 기존 토스트 제거
  const existingToast = document.getElementById('toast-container');
  if (existingToast) {
    document.body.removeChild(existingToast);
  }

  // 토스트 컨테이너 생성
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.style.position = 'fixed';
  toastContainer.style.bottom = '20px';
  toastContainer.style.left = '50%';
  toastContainer.style.transform = 'translateX(-50%)';
  toastContainer.style.zIndex = '9999';
  toastContainer.style.padding = '12px 24px';
  toastContainer.style.borderRadius = '8px';
  toastContainer.style.color = '#fff';
  toastContainer.style.fontSize = '14px';
  toastContainer.style.textAlign = 'center';
  toastContainer.style.transition = 'all 0.3s ease';
  toastContainer.style.opacity = '0';

  // 타입별 스타일 설정
  switch (type) {
    case 'success':
      toastContainer.style.backgroundColor = '#4CAF50';
      break;
    case 'error':
      toastContainer.style.backgroundColor = '#f44336';
      break;
    case 'warning':
      toastContainer.style.backgroundColor = '#ff9800';
      break;
    case 'info':
      toastContainer.style.backgroundColor = '#2196F3';
      break;
  }

  toastContainer.textContent = message;
  document.body.appendChild(toastContainer);

  // 애니메이션 효과
  setTimeout(() => {
    toastContainer.style.opacity = '1';
  }, 100);

  // 3초 후 제거
  setTimeout(() => {
    toastContainer.style.opacity = '0';
    setTimeout(() => {
      if (document.body.contains(toastContainer)) {
        document.body.removeChild(toastContainer);
      }
    }, 300);
  }, 3000);
}; 