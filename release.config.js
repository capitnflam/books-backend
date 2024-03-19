const customTransform = require('./tools/commit-transform')
const plugins = require('./tools/plugins')

/**
 * @type {import('semantic-release').Options}
 */
module.exports = {
  branches: ['main'],
  releaseRules: plugins[0][1].releaseRules,
  parserOpts: {
    mergePattern: /^Merge pull request #(\d+) from (.*)$/,
    mergeCorrespondence: ['id', 'source'],
  },
  writerOpts: { transform: customTransform },
  plugins,
}
