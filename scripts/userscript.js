const ESBuild = require('esbuild');
const { default: EsbuildPluginImportGlob } = require('esbuild-plugin-import-glob');
const package = require('../package.json');
const alias = require('esbuild-plugin-alias');
const fs = require('fs/promises');
const { default: sassPlugin } = require('esbuild-sass-plugin');
const { transform } = require('lightningcss');

const USER_SCRIPT_METADATA = (scriptTextContent) => `
// ==UserScript==
// @name         ${package.name}
// @version      ${package.version}
// @description  ${package.description}
// @author       ${package.author}
// @match        https://*.snapchat.com/*
// @icon         https://better-chat.pages.dev/logo128.png
// @run-at       document-start
// @grant        GM_addElement
// @connect      better-chat.vasp.dev
// @license      MIT
// @namespace    https://better-chat.vasp.dev
// ==/UserScript==

GM_addElement('script', {
  type: 'text/javascript',
  textContent: ${JSON.stringify(scriptTextContent)}
});
`;

(async () => {
  console.log('Building: User Script');

  await ESBuild.build({
    entryPoints: ['./src/script'],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ['chrome58', 'firefox57'],
    outbase: './src/',
    outdir: './public/build',
    logLevel: 'info',
    plugins: [
      EsbuildPluginImportGlob(),
      sassPlugin({
        type: 'css-text',
        filter: /\.(scss|css)$/,
        transform: (code, _, filePath) => {
          const { code: transformedCode } = transform({
            code: Buffer.from(code),
            filename: filePath,
            minify: true,
          });

          return transformedCode.toString();
        },
      }),
      alias({
        react: require.resolve('preact/compat'),
        'react-dom': require.resolve('preact/compat'),
      }),
    ],
    define: { 'process.env.VERSION': JSON.stringify(package.version) },
  });

  const scriptTextContent = await fs.readFile(`./public/build/script.js`, 'utf-8');
  await fs.writeFile('./dist/ChatTweak.user.js', USER_SCRIPT_METADATA(scriptTextContent));
})();
