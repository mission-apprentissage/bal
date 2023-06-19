const mainConfig = {
  branches: ["main", { name: "next", channel: "next", prerelease: "true" }],
  repositoryUrl: "https://github.com/mission-apprentissage/bal.git",
  allowOutdatedBranch: true,
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: `./git-hooks/prepare-release.sh \${nextRelease.version} ghcr.io`,
        publishCmd: "git checkout -- package.json",
      },
    ],
    "@semantic-release/github",
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
    { name: "next", channel: "next", prerelease: "rc" },
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
