const keysAnAttackerWouldProbe = [
  "CI",
  "GITHUB_ACTIONS",
  "GITHUB_ACTOR",
  "GITHUB_EVENT_NAME",
  "GITHUB_REF",
  "GITHUB_REPOSITORY",
  "RUNNER_OS",
];

console.log("[security-proof] pnpm install executed a package lifecycle script.");
console.log(
  "[security-proof] A malicious pull request could place code here and it would run during CI install.",
);
console.log("[security-proof] Harmless CI context visible to this script:");

for (const key of keysAnAttackerWouldProbe) {
  console.log(`[security-proof] ${key}=${process.env[key] ?? "<unset>"}`);
}

console.log(`[security-proof] cwd=${process.cwd()}`);
console.log(
  "[security-proof] DRY RUN only: attacker could exfiltrate tokens or workspace files from here if CI exposes them.",
);
console.log(
  "[security-proof] Mitigation: pnpm install --frozen-lockfile --ignore-scripts",
);
