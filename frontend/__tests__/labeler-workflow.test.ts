import fs from "fs";
import path from "path";

describe("Pull Request Labeler workflow security & permissions (#55)", () => {
  const frontendDir = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(frontendDir, "..");
  const workflowPath = path.join(repoRoot, ".github", "workflows", "labeler.yml");
  const labelerConfigPath = path.join(repoRoot, ".github", "labeler.yml");

  it("triggers on pull_request and drops pull_request_target", () => {
    const workflow = fs.readFileSync(workflowPath, "utf8");
    expect(workflow).not.toMatch(/\bpull_request_target\b/);
    expect(workflow).toMatch(/on:\s*\n\s*pull_request:/);
  });

  it("scopes permissions to contents: read and pull-requests: write only", () => {
    const workflow = fs.readFileSync(workflowPath, "utf8");
    expect(workflow).toContain("permissions: {}");
    expect(workflow).toContain("contents: read");
    expect(workflow).toContain("pull-requests: write");
    expect(workflow).not.toContain("write-all");
    expect(workflow).not.toContain("contents: write");
  });

  it("restricts write-capable labeler execution to non-fork pull requests", () => {
    const workflow = fs.readFileSync(workflowPath, "utf8");
    expect(workflow).toContain(
      "if: github.event.pull_request.head.repo.full_name == github.repository"
    );
    expect(workflow).toContain("uses: actions/labeler@v5");
  });

  it("preserves .github/labeler.yml path rules including frontend/**", () => {
    const labelerRules = fs.readFileSync(labelerConfigPath, "utf8");
    expect(labelerRules).toContain("frontend:");
    expect(labelerRules).toContain("any-glob-to-any-file: 'frontend/**'");
    expect(labelerRules).toContain("backend:");
    expect(labelerRules).toContain("contracts:");
    expect(labelerRules).toContain("docs:");
  });
});
