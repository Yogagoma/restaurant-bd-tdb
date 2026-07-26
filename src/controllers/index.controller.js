const packageJson = require("../../package.json");

class IndexController {
  getMetadata = async (req, res) => {
    res.send({ name: packageJson.name, version: packageJson.version });
  };
}

module.exports = new IndexController();
