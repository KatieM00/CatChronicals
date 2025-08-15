export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - for older browsers
    navigator.msMaxTouchPoints > 0
  )
}

export function isMobile(): boolean {
  return window.innerWidth <= 768
}

export function isTablet(): boolean {
  return window.innerWidth > 768 && window.innerWidth <= 1024
}

export function isDesktop(): boolean {
  return window.innerWidth > 1024
}
