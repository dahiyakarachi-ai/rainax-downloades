// plugins/withKotlinVersion.js
const { withProjectBuildGradle } = require('expo/config-plugins');

module.exports = function withKotlinVersion(config, props = {}) {
  const version = props.version || '2.2.20';

  return withProjectBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') return cfg;

    let src = cfg.modResults.contents;

    // Ensure the ext block under buildscript includes kotlinVersion
    if (!/buildscript\s*{[^}]*ext\s*{/.test(src)) {
      src = src.replace(
        /buildscript\s*{/,
        `buildscript {\n  ext {\n    kotlinVersion = '${version}'\n    kotlin_version = '${version}'\n  }`
      );
    } else {
      if (/kotlinVersion\s*=/.test(src)) {
        src = src.replace(
          /kotlinVersion\s*=\s*['"].*?['"]/,
          `kotlinVersion = '${version}'`
        );
      } else {
        src = src.replace(/ext\s*{/, `ext {\n    kotlinVersion = '${version}'`);
      }
      if (/kotlin_version\s*=/.test(src)) {
        src = src.replace(
          /kotlin_version\s*=\s*['"].*?['"]/,
          `kotlin_version = '${version}'`
        );
      }
    }

    cfg.modResults.contents = src;
    return cfg;
  });
};
