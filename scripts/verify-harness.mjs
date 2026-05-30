import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function assertExists(relativePath) {
  if (!existsSync(path.join(root, relativePath))) {
    fail(`Missing required harness artifact: ${relativePath}`);
  }
}

function walk(dir) {
  const absoluteDir = path.join(root, dir);
  if (!existsSync(absoluteDir)) {
    return [];
  }

  return readdirSync(absoluteDir).flatMap((entry) => {
    const absolutePath = path.join(absoluteDir, entry);
    const relativePath = path.relative(root, absolutePath).replaceAll("\\", "/");
    if (entry === "node_modules" || entry === ".next" || entry === ".git") {
      return [];
    }
    return statSync(absolutePath).isDirectory() ? walk(relativePath) : [relativePath];
  });
}

[
  "AGENTS.md",
  "docs/README.md",
  "docs/production-ready-agent-harness.md",
  "docs/production-readiness-task-plan.md",
  "docs/task_tracker.md",
  "docs/quality-score.md",
  "docs/tech-debt-tracker.md",
  "docs/exec-plans/README.md",
  "docs/exec-plans/active/.gitkeep",
  "docs/exec-plans/completed/.gitkeep",
].forEach(assertExists);

const agents = existsSync(path.join(root, "AGENTS.md")) ? read("AGENTS.md") : "";
for (const requiredReference of [
  "docs/task_tracker.md",
  "docs/production-ready-agent-harness.md",
  "docs/production-readiness-task-plan.md",
]) {
  if (!agents.includes(requiredReference)) {
    fail(`AGENTS.md must reference ${requiredReference}`);
  }
}

const packageJson = JSON.parse(read("package.json"));
if (packageJson.scripts?.["verify:harness"] !== "node scripts/verify-harness.mjs") {
  fail('package.json must define "verify:harness": "node scripts/verify-harness.mjs"');
}

if (!existsSync(path.join(root, ".github/workflows/ci.yml"))) {
  fail("Missing CI workflow: .github/workflows/ci.yml");
}

const apiHelperPath = "lib/api/response.ts";
assertExists(apiHelperPath);
if (existsSync(path.join(root, apiHelperPath))) {
  const apiHelper = read(apiHelperPath);
  for (const symbol of ["apiSuccess", "apiError", "apiValidationError"]) {
    if (!apiHelper.includes(`function ${symbol}`)) {
      fail(`${apiHelperPath} must export ${symbol}`);
    }
  }
}

for (const file of walk("app/api").filter((file) => file.endsWith("/route.ts"))) {
  if (file === "app/api/auth/[...nextauth]/route.ts") {
    continue;
  }
  const contents = read(file);
  if (contents.includes("NextResponse.json")) {
    fail(`${file} must use shared API response helpers instead of NextResponse.json directly`);
  }
}

for (const file of walk("app/(public)").filter((file) => file.endsWith(".tsx"))) {
  const contents = read(file);
  if (/^['"]use client['"];?/m.test(contents)) {
    fail(`${file} is a public route file and must not be a Client Component by default`);
  }
  if (contents.includes("@tanstack/react-query")) {
    fail(`${file} must not use TanStack Query for primary public content`);
  }
}

const harness = existsSync(path.join(root, "docs/production-ready-agent-harness.md"))
  ? read("docs/production-ready-agent-harness.md")
  : "";
for (const heading of ["Agent Implementation Workflow", "Definition of Done"]) {
  if (!harness.includes(heading)) {
    fail(`Production harness must include ${heading}`);
  }
}

if (failures.length > 0) {
  console.error("Harness verification failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Harness verification passed.");
