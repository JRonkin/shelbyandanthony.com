import '../../sass/pages/about.scss';
import { initCommon } from '../common/common.js';
import { Gallery } from '../modules/Gallery.js';

initCommon();

const galleries = Array.from(document.querySelectorAll('.js-gallery'))
  .map(el => new Gallery(el));
