export default {
  scripts: {
    test: "deno test --allow-all ./**/*.spec.ts --config deno.json",
    start: "deno run --config deno.json --allow-net ./src/main.ts",
  },
};
