module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    ['@semantic-release/npm', {
      tarballDir: 'release'
    }],
    ['@semantic-release/github', {
      assets: 'release/*.tgz'
    }],
    '@semantic-release/git'
  ],

  preset: 'conventionalcommits'
}
