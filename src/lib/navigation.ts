/**
 * Navigates to a clean path dynamically using the HTML5 History API.
 * This triggers a popstate event so that React state listeners are notified of URL changes.
 */
export const navigate = (to: string) => {
  window.history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
};
