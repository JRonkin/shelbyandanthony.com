const path = require('path');
const glob = require('glob');
const sizeOf = require('image-size');
const soynode = require('soynode');

soynode.setOptions({
  eraseTemporaryFiles: true,
  outputDir: './.tmp/soynode'
});

class RenderSoyPlugin {
  static get defaultOptions() {
    return {
      templateData: {},
      templateFiles: path.resolve(__dirname, '**', '*.soy'),
      templates: {}
    };
  }

  constructor(options = {}) {
    this.options = { ...this.constructor.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = this.constructor.name;

    this.webpack = compiler.webpack;

    compiler.hooks.beforeCompile.tap(pluginName, () => this.compilationPromise = this.compileTemplates());
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: this.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_HASH,
        },
        async assets => this.renderTemplates(compilation, assets)
      );
    });
  }

  buildTemplateData(templateFilename, assets) {
    const { goog } = soynode.getSoyVmContext().getContext();
    const baseUrl = (path.relative(path.dirname(templateFilename), '.') || '.') + '/';

    return {
      assets: Object.fromEntries(
        Object.entries(assets).map(([filepath, asset]) => {
          const assetBuffer = asset.buffer();
          const assetData = {
            height: 0,
            orientation: 1,
            path: filepath,
            size: assetBuffer.length,
            trustedUrl: goog.html.TrustedResourceUrl.fromConstant(goog.string.Const.from(baseUrl + filepath)),
            url: baseUrl + filepath,
            width: 0
          };

          try {
            // TODO: Move this to its own plugin
            const { height, orientation, width } = sizeOf(assetBuffer);

            Object.assign(assetData, { height, orientation, width });
          } catch {}

          return [filepath.replace(/\.[0-9a-f]+(\.[^.]+)$/, (m, p1) => p1), assetData];
        })
      ),
      baseUrl,
      pathname: templateFilename,
      ...this.options.templateData
    };
  }

  async compileTemplates() {
    await new Promise((resolve, reject) => {
      glob(this.options.templateFiles, (err, files) => {
        if (err) {
          reject(err);
        }

        this.templateFiles = files;
        soynode.compileTemplateFiles(files, err => err ? reject(err) : resolve());
      });
    });
  }

  async renderTemplates(compilation, assets) {
    await this.compilationPromise;
    compilation.fileDependencies.addAll(this.templateFiles);

    for (const [template, urlTemplate] of Object.entries(this.options.templates)) {
      const templateFilename = soynode.render(urlTemplate);
      const templateData = this.buildTemplateData(templateFilename, assets);

      try {
        compilation.emitAsset(
          templateFilename,
          new this.webpack.sources.RawSource(soynode.render(template, templateData))
        );
      } catch (err) {
        console.error(`Error rendering template "${template}"`);
        throw err;
      }
    }
  }
}

module.exports = RenderSoyPlugin;
