const { withProjectBuildGradle } = require('@expo/config-plugins');

/**
 * Pins the Kotlin Gradle plugin version in android/build.gradle.
 *
 * Fixes: "Could not get unknown property 'kotlinVersion' for object of type
 * DefaultDependencyHandler" (build.gradle references $kotlinVersion in the
 * buildscript dependencies block, but nothing defines it).
 */
module.exports = function withKotlinVersion(config, props = {}) {
  const version = props.version || '2.2.20';

  return withProjectBuildGradle(config, (cfg) => {
    let src = cfg.modResults.contents;

    // 1. Make sure the Kotlin classpath uses a literal version.
    src = src.replace(
      /(org\.jetbrains\.kotlin:kotlin-gradle-plugin)(:\$\{?kotlinVersion\}?|:[\w.\-]+)?/g,
      `$1:${version}`
    );

    // 2. Define kotlinVersion inside buildscript.ext for any other references.
    const hasDefinition = /kotlinVersion\s*=/.test(src);
    if (hasDefinition) {
      src = src.replace(
        /kotlinVersion\s*=\s*(['"]).*?\1/,
        `kotlinVersion = '${version}'`
      );
    } else if (/buildscript\s*{/.test(src)) {
      src = src.replace(
        /buildscript\s*{/,
        `buildscript {\n    ext {\n        kotlinVersion = '${version}'\n    }`
      );
    }

    cfg.modResults.contents = src;
    return cfg;
  });
};
