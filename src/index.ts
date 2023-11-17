#!/usr/bin/env node
import { cli } from 'cleye'
import packJson from '../package.json'
import execDiff from './exec'
import hanldeApng from './utils/handleApng'

const argv = cli({
  name: 'zelda-image-compression',
  version: packJson.version,
  description: 'image-compression',
  flags: {
    path: {
      type: String,
      description: 'Input your file path',
      alias: 'p',
    },
  },
})

// const { path } = argv.flags

execDiff()
// hanldeApng()
