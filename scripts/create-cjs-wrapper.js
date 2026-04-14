import { writeFileSync } from "fs";
writeFileSync(
  "dist/index.cjs",
  `const { pathToFileURL } = require("url");\nconst { join } = require("path");\nimport(pathToFileURL(join(__dirname, "index.js")).href).catch(console.error);\n`
);
console.log("Created dist/index.cjs wrapper");
