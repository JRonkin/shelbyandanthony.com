export function setScrollLocked(locked) {
  const scrollLockClass = 'u-noscroll';

  if (locked && !document.documentElement.classList.contains(scrollLockClass)) {
    document.documentElement.style.top = `${-window.scrollY}px`;
    document.documentElement.style.left = `${-window.scrollX}px`;
    document.documentElement.classList.add(scrollLockClass);
  } else if (!locked && document.documentElement.classList.contains(scrollLockClass)) {
    const top = document.documentElement.offsetTop;
    const left = document.documentElement.offsetLeft;

    document.documentElement.classList.remove(scrollLockClass);
    document.documentElement.style.top = '';
    document.documentElement.style.left = '';
    window.scrollTo(-left, -top);
  }
}
