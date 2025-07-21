export const getEmailForVerification = () => {
  if (typeof window === 'undefined') return '';
  const paramsEmail = new URLSearchParams(window.location.search).get('email');
  return paramsEmail || localStorage.getItem('email');
};
