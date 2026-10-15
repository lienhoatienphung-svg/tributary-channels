const fs = require("fs");
const path = require("path");

describe("deploy-staging.yml rollback workflow (#56)", () => {
  const repoRoot = path.resolve(__dirname, "../..");
  const workflowContent = fs.readFileSync(
    path.join(repoRoot, ".github/workflows/deploy-staging.yml"),
    "utf8"
  );
  const composeContent = fs.readFileSync(
    path.join(repoRoot, "docker-compose.staging.yml"),
    "utf8"
  );

  it("records deployed_tag as a job output on deploy-staging", () => {
    expect(workflowContent).toMatch(/outputs:\s*\n\s*deployed_tag:/);
    expect(workflowContent).toMatch(/deployed_tag=staging-\$\{SHORT_SHA\}/);
  });

  it("resolves previous staging-<sha> tag from package versions without indexing manifests[1] and fails loudly when missing", () => {
    expect(workflowContent).not.toContain("manifests[1]");
    expect(workflowContent).toMatch(/select\(test\("\^staging-[0-9a-f]{7,40}$"\)\)/);
    expect(workflowContent).toMatch(/if [ -z "\$\{PREV_TAG\}" ]; then[\s\S]*?exit 1/);
  });

  it("redeploys the resolved previous tag through docker-compose.staging.yml and reports actual outcome in issue body", () => {
    expect(workflowContent).toMatch(/docker compose -f docker-compose\.staging\.yml up -d --force-recreate/);
    expect(composeContent).toContain("${STAGING_IMAGE_TAG:-staging}");
    expect(workflowContent).toContain("Rollback Status:");
  });

  it("keeps the smoke-test job running node scripts/smoke-test.js against STAGING_URL", () => {
    expect(workflowContent).toContain("STAGING_URL: https://staging.stellarmicropay.io");
    expect(workflowContent).toContain("run: node scripts/smoke-test.js");
  });
});
