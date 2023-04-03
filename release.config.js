const mainConfig = {
  branches: ["main"],
  repositoryUrl: "https://github.com/mission-apprentissage/bal.git",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/exec",
      {
        prepareCmd: "./git-hooks/prepare-release.sh ${nextRelease.version}",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: [
          ".infra/env.ini",
          ".github/workflows/_deploy.yml",
          "ui/package.json",
          "server/package.json",
          "shared/package.json",
          "CHANGELOG.md",
          "package.json",
        ],
        message:
          // eslint-disable-next-line no-template-curly-in-string
          "chore(release): bump ${nextRelease.version}",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        publishCmd: "git checkout -- package.json",
      },
    ],
    [
      "semantic-release-slack-bot",
      {
        notifyOnSuccess: true,
        notifyOnFail: true,
        markdownReleaseNotes: true,
      },
    ],
  ],
};

const { execSync } = require("child_process");
const { createHash } = require("crypto");

const branch = execSync("git branch --show-current").toString().trimEnd("\n");
const channel = createHash("md5").update(branch).digest("hex");

const localConfig = {
  branches: [
    "main",
    {
      name: branch,
      channel,
      prerelease: channel,
    },
  ],
  repositoryUrl: "https://github.com/mission-apprentissage/bal.git",
  plugins: ["@semantic-release/commit-analyzer"],
};

module.exports = process.env.LOCAL_RELEASE ? localConfig : mainConfig;
