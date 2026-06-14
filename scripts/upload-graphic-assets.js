#!/usr/bin/env node
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ENV_ID = 'cloud1-d8gw5r2il0c0f198a'
const args = new Set(process.argv.slice(2))
const verifyOnly = args.has('--verify-only')
const manifestArg = process.argv.slice(2).find((arg) => arg.endsWith('.json'))
const manifestPath = manifestArg
  ? path.resolve(process.cwd(), manifestArg)
  : path.resolve(__dirname, 'graphic-assets-manifest.json')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

function run(command, commandArgs) {
  return execFileSync(command, commandArgs, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

function uploadAsset(asset) {
  run('cloudbase', [
    'storage',
    'upload',
    asset.source,
    asset.cloudPath,
    '--env-id',
    ENV_ID,
    '--times',
    '3',
  ])
}

function getTempUrl(asset) {
  const output = run('cloudbase', [
    'storage',
    'url',
    asset.cloudPath,
    '--env-id',
    ENV_ID,
    '--json',
  ])
  return JSON.parse(output).data
}

let uploaded = 0
let verified = 0
const failed = []

for (const asset of manifest.assets) {
  if (!fs.existsSync(asset.source)) {
    failed.push({ path: asset.path, reason: `source missing: ${asset.source}` })
    continue
  }

  try {
    if (!verifyOnly) {
      uploadAsset(asset)
      uploaded += 1
    }
    const url = getTempUrl(asset)
    if (!url) {
      failed.push({ path: asset.path, reason: 'no temp url returned' })
    } else {
      verified += 1
    }
  } catch (error) {
    failed.push({ path: asset.path, reason: error.stderr || error.message })
  }
}

console.log(JSON.stringify({
  mode: verifyOnly ? 'verify-only' : 'upload-and-verify',
  total: manifest.assets.length,
  uploaded,
  verified,
  failed,
}, null, 2))

if (failed.length) process.exit(1)
