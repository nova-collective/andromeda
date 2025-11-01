/**
 * This script implements logic delegated from the GitHub Actions workflows.
 * The workflow invokes the API interface using the CLI with the following command:
 *
 *  node ci --function functionOne --params '{"param1": "value1", "param2": "value2"}'
 */
import functions from "./functions.js";

const args = process.argv.slice(2);

if (args.length < 2 || args[0] !== "--function") {
  console.error(
    "Correct usage: node ci --function <functionName> --params '{\"param1\": \"value1\", \"param2\": \"value2\"}'",
  );
  process.exit(1);
}

const functionName = args[1];

let params;
if (args[3]) {
  params = JSON.parse(args[3]);
}

try {
  const fn = functions[functionName];
  if (typeof fn !== "function") {
    throw new Error(`Function "${functionName}" is not defined.`);
  }
  fn(params);
} catch (error) {
  console.error(
    "Error: the function invoked does not exists or there is an error in the function",
  );
  console.error(error);
  process.exit(1);
}
