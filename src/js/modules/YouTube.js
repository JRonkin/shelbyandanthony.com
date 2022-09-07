export class YouTube {
  constructor(el) {
    this.el = el;
    this.iframe = el.querySelector('.js-youtube-iframe');
    this.playBtn = el.querySelector('.js-youtube-play');

    this._init();
  }

  _init() {
    this.playBtn.addEventListener('click', () => {
      this.iframe.src = this.iframe.dataset.src;
    });
  }
}
