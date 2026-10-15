import fs from "fs";
import path from "path";

describe("Playwright E2E script and workflow configuration (#54)", () => {
  const frontendDir = path.resolve(__dirname, "..");
  const repoRoot = path.resolve(frontendDir, "..");

  it("executes all specs in frontend/e2e/ via npm run test:e2e", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(frontendDir, "package.json"), "utf8")
    );
    expect(pkg.scripts["test:e2e"]).toBe(
      "playwright test e2e --project=chromium"
    );
    expect(pkg.scripts["test:e2e"]).not.toContain("ci-smoke.spec.ts");
  });

  it("retains a dedicated fast smoke target for ci-smoke.spec.ts", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(frontendDir, "package.json"), "utf8")
    );
    expect(pkg.scripts["test:e2e:smoke"]).toBe(
      "playwright test e2e/ci-smoke.spec.ts --project=chromium"
    );
  });

  it("discovers all nine spec files in frontend/e2e/", () => {
    const e2eDir = path.join(frontendDir, "e2e");
    const specs = fs
      .readdirSync(e2eDir)
      .filter((file) => file.endsWith(".spec.ts"))
      .sort();

    expect(specs).toEqual([
      "ai-assistant-shortcut.spec.ts",
      "ci-smoke.spec.ts",
      "dashboard.spec.ts",
      "full-journey.spec.ts",
      "landing.spec.ts",
      "navbar-mobile.spec.ts",
      "tip.spec.ts",
      "transactions.spec.ts",
      "visual-regression.spec.ts",
    ]);
    expect(specs).toHaveLength(9);
  });

  it("runs visual-regression.spec.ts explicitly in .github/workflows/visual-regression.yml", () => {
    const workflow = fs.readFileSync(
      path.join(repoRoot, ".github", "workflows", "visual-regression.yml"),
      "utf8"
    );
    expect(workflow).toContain(
      "npx playwright test e2e/visual-regression.spec.ts --project=chromium"
    );
    expect(workflow).not.toContain("run: npm run test:e2e");
  });

  it("runs npm run test:e2e in the e2e job of .github/workflows/ci.yml", () => {
    const ciWorkflow = fs.readFileSync(
      path.join(repoRoot, ".github", "workflows", "ci.yml"),
      "utf8"
    );
    expect(ciWorkflow).toContain("run: npm run test:e2e");
  });
});
