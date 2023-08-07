module.exports = {
  branches: ["main", { name: "next", channel: "next", prerelease: "rc" }],
  repositoryUrl: "https://github.com/mission-apprentissage/bal.git",
  allowOutdatedBranch: true,
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        prepareCmd: `.bin/mna-bal release:app \${nextRelease.version} push`,
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
