const glob = require('glob');
const fs = require('fs');
const path = require('path');
const generateServiceWorkerFile = require('./generate-service-worker-file');

module.exports = function createSw({
  filePattern,
  ignorePattern,
  version,
  distDir,
  prepend,
  revision,
}) {
  let filename = `${['sw', revision].filter(Boolean).join('.')}.js`;
  if (Array.isArray(ignorePattern)) {
    ignorePattern.push(filename);
  } else if (ignorePattern) {
    ignorePattern = [ignorePattern, filename];
  } else {
    ignorePattern = filename;
  }
  let files = glob.sync(filePattern, { ignore: ignorePattern, cwd: distDir });

  let fileContent = generateServiceWorkerFile({ files, prepend, version });
  let swFilePath = path.join(distDir, filename);

  fs.writeFileSync(swFilePath, fileContent, 'utf-8');

  return path.relative(distDir, swFilePath);
};
