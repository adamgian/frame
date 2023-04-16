/*
 * Stylesheets
 */

// Note: not required here, CSS is already processed and built
// while building the ESM entry point.


/*
 * Javascript assets
 */

// Polyfills:
import 'element-closest-polyfill';
import 'whatwg-fetch';

import './components/_async-page-load.js';
import './components/_service-worker.js';
import './components/_webfont.js';
