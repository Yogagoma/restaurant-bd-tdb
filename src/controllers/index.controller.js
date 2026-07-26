const packageJson = require("../../package.json");

class IndexController {
  static async getMetadata(req, res) {
    res.send({ name: packageJson.name, version: packageJson.version });
  }
}

module.exports = IndexController;
