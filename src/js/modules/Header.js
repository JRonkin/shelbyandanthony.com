import { setScrollLocked } from '../common/helpers.js';

export class Header {
  constructor({
    bpDesktopMin = 768,
    el = document.querySelector('.js-header'),
    toggleEl = el.querySelector('.js-header-toggle')
  } = {}) {
    this.bpDesktopMin = bpDesktopMin;
    this.el = el;
    this.toggleEl = toggleEl;
    this.menuEl = document.getElementById(this.toggleEl.getAttribute('aria-controls'));

    this.init();
  }

  close() {
    setScrollLocked(false);
    this.el.classList.remove('is-expanded');
    this.menuEl.setAttribute('aria-expanded', 'false');
    this.menuEl.setAttribute('aria-hidden', 'true');
  }

  init() {
    window.matchMedia(`(min-width: ${this.bpDesktopMin}px)`).addListener(e => {
      if (e.matches) {
        this.close();
      }
    });
    this.toggleEl.addEventListener('click', () => this.toggle());
  }

  isOpen() {
    return this.el.classList.contains('is-expanded');
  }

  open() {
    setScrollLocked(true);
    this.toggleEl.classList.remove('u-notransition');
    this.el.classList.add('is-expanded');
    this.menuEl.setAttribute('aria-expanded', 'true');
    this.menuEl.setAttribute('aria-hidden', 'false');
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}
