export function css(identifier: string) {
  return getComputedStyle(document.body).getPropertyValue(identifier).trim();
}
