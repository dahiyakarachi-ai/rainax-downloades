const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withKotlinVersion(config, props = {}) {
  const version = props.version || '2.2.20';

  return withProjectBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents;

    // Ensure kotlinVersion is set inside the buildscript ext block
    if (/kotlinVersion\s*=/.test(src)) {
      src = src.replace(
        /kotlinVersion\s*=\s*['"].*?['"]/,
        `kotlinVersion = '${version}'`
      );
    } else {
      // Add it if missing
      src = src.replace(
        /ext\s*{/,
        `ext {\n    kotlinVersion = '${version}'`
      );
    }

    cfg.modResults.contents = src;
    return cfg;
  });
};
