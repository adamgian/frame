

# Frame

Frame is a performant, JAMstack scaffold that utilises Jekyll as the SSG (static site generator).

Allows for rapid prototyping and development of sites, time is cut drastically




## Usage

#### Setup
1\. Install required Ruby and npm dependencies
```shell
bundle install
npm ci
```

2\. Install libvips and image formats for jekyll_picture_tag
```shell
sudo apt install libvips-tools
sudo apt install libpng-dev libwebp-dev libjpeg-dev libheif-dev
```

#### Development & deployment
Run ESLint
```shell
npm run test
```

Run Webpack bundle analyzer
```shell
npm run analyze
```

Serve development Jekyll and Webpack
```shell
npm start
# alternatively:
npm run dev
```

Build production Jekyll and Webpack
```shell
npm run build
```




## The stack

* Jekyll 4
	* jekyll_picture_tag
* Webpack 5
	* @babel/preset-env
	* terser
* SCSS and PostCSS
	* autoprefixer
	* cssnano
* NPM
* ESLint




## Code structure

<pre>
📂 <a href="#root">root</a>
 ├─ 📂 <a href="#config">config</a>
 │   ├─ <a href="#config-eslint">.eslintrc</a>
 │   ├─ <a href="#config-yaml">config-dev.yaml</a>
 │   ├─ <a href="#config-yaml">config.yaml</a>
 │   ├─ <a href="#config-webpack">webpack-dev.config.js</a>
 │   └─ <a href="#config-webpack">webpack-prod.config.js</a>
 ├─ 📁 <a href="#dist">dist</a>
 ├─ 📂 <a href="#src">src</a>
 │   ├─ 📂 <a href="#src-data">_data</a>
 │   ├─ 📂 <a href="#src-includes">_includes</a>
 │   ├─ 📂 <a href="#src-layouts">_layouts</a>
 │   ├─ 📂 <a href="#src-plugins">_plugins</a>
 │   ├─ 📂 <a href="#src-assets">assets</a>
 │   └─ 📂 <a href="#src-pages">pages</a>
 ├─ <a href="#root-editorconfig">.editorconfig</a>
 ├─ .gitignore
 ├─ Gemfile
 ├─ <a href="#root-netlifytoml">netlify.toml</a>
 ├─ package.json
 └─ README.md
</pre>


### root

<h4 id="root-editorconfig">/.editorconfig</h4>
See https://editorconfig.org for more information.

<h4 id="root-netlifytoml">/netlify.toml</h4>
Configuration used by Netlify (if hosted there) for specifying the build, deploy settings and environment variables. See https://docs.netlify.com/configure-builds/file-based-configuration/ for more information.


### /src/
Project source files (barring config) are located within this directory.

<h4 id="src-data">/src/_data/</h4>
Jekyll folder. See https://jekyllrb.com/docs/datafiles/ for more information.

<h4 id="src-includes">/src/_includes/</h4>
Jekyll folder. See https://jekyllrb.com/docs/includes/ for more information.

<h4 id="src-layouts">/src/_layouts/</h4>
Jekyll folder. See https://jekyllrb.com/docs/layouts/ for more information.

<h4 id="src-plugins">/src/_plugins/</h4>
Jekyll folder. See https://jekyllrb.com/docs/plugins/ for more information.

<h4 id="src-assets">/src/assets/</h4>
Site assets are contained in this directory, i.e.: styles, scripts, images and videos.

When building, Jekyll will essentially copy this folder one-for-one into `/dist/assets/`. The exceptions to this are Webpack generated bundles (source styles and scripts are not copied, instead the bundle will be copied over) and files with a permalink defined in the Jekyll front matter. For example, sitemap.xml for organisational purposes will be found in `/src/assets/misc/sitemap.xml` but will be moved by Jekyll to `/dist/` when built.

<h4 id="src-pages">/src/pages/</h4>
Site pages are contained in this directory.


### /config/

<h4 id="config-eslint">/config/.eslintrc</h4>
ESLint configuration file.

<h4 id="config-config-yaml">/config/config-dev.yaml <br>/config/config.yaml</h4>
Two configuration files for Jekyll:

* `/config/config.yaml` — main configuration file used in development and production. In production, only this file will be referenced.
* `/config/config-dev.yaml` — additional configuration file used in development. Settings in this file will override the values in the main file.

<h4 id="config-webpack">/config/webpack-dev.js <br>/config/webpack-prod.js</h4>
Two seperate webpack configurations for development and production:

* `webpack-dev.config.js`
* `webpack-prod.config.js` — will output two production optimised bundles: ESM (for current browsers) and ES5 (for legacy browsers)


### /dist/
Optimized code/content will generated/compiled and placed into this directory. The dist directory should not be checked into source control.
