// src/utils/menuPosition.js
// Small helper to compute a fixed-position dropdown menu near a trigger button,
// clamped within the viewport with a small margin.

export function computeFixedMenuPosition(btnEl, menuEl, options = {}) {
  const margin = Number.isFinite(options.margin) ? options.margin : 8
  try {
    if (!btnEl) return { left: '0px', top: '0px' }
    const rect = typeof btnEl.getBoundingClientRect === 'function'
      ? btnEl.getBoundingClientRect()
      : { left: 0, right: 0, top: 0, bottom: 0, height: 0, width: 0 }
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0
    const menuWidth = (menuEl && menuEl.offsetWidth) || 224
    const menuHeight = (menuEl && menuEl.offsetHeight) || 200

    // Horizontal positioning:
    // Default: left-align to trigger (menu left = trigger left)
    // If not enough space to the right, right-align to trigger (menu left = trigger right - menuWidth)
    const spaceRight = viewportWidth - rect.right
    let left
    if (spaceRight < menuWidth + margin) {
      // Align menu's right edge to trigger's right edge
      left = rect.right + window.scrollX - menuWidth
    } else {
      left = rect.left + window.scrollX
    }
    // Clamp within viewport margins
    left = Math.max(margin, Math.min(left, viewportWidth - menuWidth - margin))

    // Vertical positioning:
    // Prefer below; if not enough space, place above
    let top = rect.bottom + window.scrollY + margin
    const spaceBelow = (window.scrollY + viewportHeight) - (rect.bottom + window.scrollY)
    if (spaceBelow < menuHeight + margin && (rect.top + window.scrollY) - menuHeight - margin >= window.scrollY) {
      top = rect.top + window.scrollY - menuHeight - margin
    }

    return { left: left + 'px', top: top + 'px' }
  } catch (_) {
    return { left: '0px', top: '0px' }
  }
}
