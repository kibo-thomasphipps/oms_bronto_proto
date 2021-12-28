const chokidar = require("chokidar");
const { TemplateParser } = require("./teamplate");
const fs = require("fs");
const fsPromises = fs.promises;
const path = require('path');

class TemplateManager {
  constructor({ templatePath }) {
    this.cache = {};
    this.templatePath = templatePath;
    this.watcher = chokidar.watch(templatePath, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
    });

    this.watcher
      .on("add", (path) => (this.cache = {}))
      .on("change", (path) => (this.cache = {}))
      .on("unlink", (path) => (this.cache = {}));
  }
  async get(relPath) {
    if (this.cache.relPath !== undefined) {
      return this.cache.relPath;
    }
    const fullPath = path.join(this.templatePath, relPath)
    let res = await fsPromises.access(fullPath);
    console.log(res);
    if ((await fsPromises.access(fullPath))!= null) {
      this.cache.path = null;
      return this.cache.relPath;
    } else {
      const rawTemplate = await fsPromises.readFile(fullPath);
      this.cache.relPath = new TemplateParser({ body: rawTemplate.toString() }).parse();
    }
    return this.cache.relPath;
  }
}
exports.TemplateManager = TemplateManager;
