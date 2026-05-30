export function requestFullscreen(el = document.documentElement) {
  const fn = el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen
  return fn ? fn.call(el) : Promise.resolve()
}

export function exitFullscreen() {
  const fn = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen
  return fn ? fn.call(document) : Promise.resolve()
}

export function isFullscreen() {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement)
}
