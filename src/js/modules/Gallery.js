import { tns } from 'tiny-slider';
import { setScrollLocked } from '../common/helpers.js';

export class Gallery {
  constructor(el) {
    this.el = el;
    this.modalEl = el.querySelector('.js-gallery-modal');
    this.modalCloseEl = this.modalEl.querySelector('.js-gallery-close');
    this.carouselEl = this.modalEl.querySelector('.js-gallery-carousel');
    this.secretEl = el.querySelector('.js-gallery-secret');
    this.modalInitialized = false;

    this._init();
  }

  _init() {
    this.el.querySelectorAll('.js-gallery-button').forEach((button, i) => {
      button.addEventListener('click', () => this.openModal(i));
    });

    for (const button of this.el.querySelectorAll('.js-gallery-secretbutton')) {
      button.addEventListener('click', () => this.revealSecrets());
    };

    if (this.secretEl && this.secretEl.dataset.audio) {
      this.secretAudioPromise = fetch(this.secretEl.dataset.audio)
        .then(res => res.blob())
        .then(audioBlob => new Audio(URL.createObjectURL(audioBlob)));
    }
  }

  _initModal() {
    this.slider = tns({
      arrowKeys: true,
      container: this.carouselEl,
      mode: 'gallery',
      mouseDrag: true,
      nav: false,
      nextButton: this.modalEl.querySelector('.js-gallery-next'),
      prevButton: this.modalEl.querySelector('.js-gallery-prev')
    });

    this.modalEl.addEventListener('click', e => {
      if (e.target == this.modalEl) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key == 'Escape') {
        this.closeModal();
      }
    });

    this.modalInitialized = true;
  }

  closeModal() {
    setScrollLocked(false);
    this.modalEl.classList.remove('is-shown');
  }

  openModal(slideIndex = 0) {
    if (!this.modalInitialized) {
      this._initModal();
    }

    setScrollLocked(true);
    this.modalEl.classList.remove('u-notransition');
    this.modalEl.classList.add('is-shown');
    this.slider.goTo(slideIndex);
  }

  async playSecretSound() {
    (await this.secretAudioPromise).play();
  }

  revealSecrets() {
    if (this.slider) {
      this.slider.destroy();
    }

    this.carouselEl = this.modalEl.querySelector('.js-gallery-carousel');

    while (this.secretEl.firstChild) {
      this.carouselEl.appendChild(this.secretEl.firstChild);
    }

    this.el.classList.add('is-secret');

    if (this.slider) {
      this.slider.rebuild();
    }

    this.playSecretSound();
  }
}
