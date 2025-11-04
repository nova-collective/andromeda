import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const execSyncOptions = { stdio: "inherit" };

const functions = {
  installDeps() {
    try {
      execSync("npm install", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  lint() {
    try {
      execSync("npm run lint", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  checksDuplications() {
    try {
      execSync("npm run duplicated", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  smartContractsUnitTest() {
    try {
      execSync("npm run test-contracts", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  scriptsUnitTest() {
    try {
      execSync("npm run test", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  scriptsCodeCoverage() {
    try {
      execSync("npm run test:coverage", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
  tagRelease() {
    try {
      const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
      const { version } = packageJson;

      const tags = execSync("git tag", { encoding: "utf8" }).split("\n");

      if (tags.includes(`v${version}`)) {
        console.error(`Error: The tag for the version ${version} already exists`);
        return;
      }

      execSync(`git tag -a v${version} -m "Version ${version}"`, execSyncOptions);
      execSync("git push origin --tags", execSyncOptions);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  },
};

export default functions;
