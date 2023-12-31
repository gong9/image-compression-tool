import { exec, execSync } from 'node:child_process'
import path from 'node:path'
import { consola } from 'consola'

import handleCompress, { traverseDirectory } from './utils/compression.js'

export const REGEX = /\.(jpg|jpeg|png|gif|webp)$/g
let rootPath: string

try {
  rootPath = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
}
catch (error) {
  console.error('获取Git工作空间路径失败:', error)
}

const execDiff = (isAll = false) => {
  const command = 'git diff --cached --name-only'
  const imagePathList: string[] = []

  if (isAll) {
    traverseDirectory(rootPath,
      (currentPath) => {
        const name = path.extname(currentPath) ?? ''
        if (name.includes('png') || name.includes('jpg') || name.includes('jpeg') || name.includes('webp')) {
          console.log(currentPath)
          imagePathList.push(currentPath)
        }
      }).then(() => {
        if (imagePathList.length > 0) {
          consola.info(`检测到图片资源: ${imagePathList.join(', ')}`)
          handleCompress(imagePathList, rootPath)
        }
        else {
          consola.info('没有检测到图片资源')
        }
      })
    return
  }

  // eslint-disable-next-line promise/param-names
  return new Promise((res, rej) => {
    exec(command, async (err, stdout: string) => {
      if (err) {
        console.error(err)
        rej(err)
      }
      else {
        if (!stdout) {
          consola.info('本次提交暂无图片资源的改动')
          res(imagePathList)
        }

        else {
          stdout.split('\n').forEach((item) => {
            // todo: 优化正则
            if (item.includes('png') || item.includes('jpg') || item.includes('jpeg') || item.includes('webp'))
              imagePathList.push(path.resolve(rootPath, item))
          })

          if (imagePathList.length > 0) {
            consola.info(`检测到图片资源: ${imagePathList.join(', ')}`)
            handleCompress(imagePathList, rootPath)
          }
          else { consola.info('本次提交无图片资源的改动') }

          res(imagePathList)
        }
      }
    })
  })
}

export default execDiff
