module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".test.ts$",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  reporters: [
    "default",
    "customReporters/basitRaporcu.js"
    ["jest-2-testrail", { project_id: "1", suite_id: "1" }]
  ]
};