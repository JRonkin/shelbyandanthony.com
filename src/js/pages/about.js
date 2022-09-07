import '../../sass/pages/about.scss';
import { initCommon } from '../common/common.js';
import { Gallery } from '../modules/Gallery.js';
import { YouTube } from '../modules/YouTube.js';

initCommon();

const galleries = Array.from(document.querySelectorAll('.js-gallery'))
  .map(el => new Gallery(el));
const ytVideos = Array.from(document.querySelectorAll('.js-youtube'))
  .map(el => new YouTube(el));
