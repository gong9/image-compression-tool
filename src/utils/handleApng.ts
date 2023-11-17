import path from 'node:path'
import { execSync } from 'node:child_process'
import parseApng from 'apng-js'
import { consola } from 'consola'
import imageminPngquant from 'imagemin-pngquant'

// @ts-expect-error
import Assembler from 'apng-assembler'
import fs from 'fs-extra'

import { isExists, remove } from './compression'
import { getAllFilesName, getDimensions, getFirstFrame, resetSize } from './'

let rootPath = ''
const allPathArr: string[] = []

const detachDir = 'apng-out'
const compressSingleFrameDir = 'apng-compress'
const standardDir = 'apng-standard'

try {
    rootPath = execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim()
}
catch (error) {
    console.error('获取Git工作空间路径失败:', error)
}

/**
 * blob to image
 * @param blob
 * @param outputFilePath
 */
async function blobToImage(blob: any, outputFilePath: string) {
    try {
        const buffer = await blob.arrayBuffer()

        fs.writeFileSync(outputFilePath, Buffer.from(buffer))
        console.log('图像保存成功！')
    }
    catch (error) {
        console.error(error)
    }
}

const compressSingleFrame = async (inputPathArr: string[]) => {
    const imagemin = (await import('imagemin')).default
    const temp = path.resolve(rootPath, compressSingleFrameDir)

    if (!await isExists(temp))
        fs.ensureDirSync(temp)
    else
        await remove(temp)

    const files = await imagemin(inputPathArr, {
        destination: temp,
        plugins: [
            imageminPngquant({
                quality: [0.6, 0.8],
            }),
        ],
    })

    return files
}

/**
 * detachApng to png
 * @param inputPath
 */
const detachApng = async (inputPath: string) => {
    const data = fs.readFileSync(inputPath)
    const anim: any = parseApng(data)
    const outputPath = path.resolve(rootPath, detachDir)

    if (!await isExists(outputPath))
        fs.ensureDirSync(outputPath)
    else
        await remove(outputPath)

    for (let i = 0; i < anim.frames.length; i++) {
        const outputFilePath = `${outputPath}/frame_${i}.png`
        allPathArr.push(outputFilePath)

        await blobToImage(anim.frames[i].imageData, outputFilePath)

        console.log(`Frame ${i} saved as ${outputFilePath}`)
    }
}

/**
 * png size standard
 */
const sizeStandard = async () => {
    consola.info('分离图片大小标准化')

    const firstFramePath = await getFirstFrame(path.resolve(rootPath, detachDir))
    const {
        width,
        height,
    } = await getDimensions(path.resolve(rootPath, detachDir, firstFramePath))

    if (!await isExists(path.resolve(rootPath, standardDir)))
        fs.ensureDirSync(path.resolve(rootPath, standardDir))
    else
        await remove(path.resolve(rootPath, standardDir))

    await resetSize(path.resolve(rootPath, detachDir), path.resolve(rootPath, standardDir), width, height)
    consola.info('分离图片大小标准化完成')
}

/**
 * png assemble Apng
 */
const assembleApng = async (isStandard = false) => {
    consola.info('开始单帧压缩')
    if (!isStandard)
        await compressSingleFrame((await getAllFilesName(path.resolve(rootPath, detachDir))).map(item => path.resolve(rootPath, detachDir, item)))

    else
        await compressSingleFrame((await getAllFilesName(path.resolve(rootPath, standardDir))).map(item => path.resolve(rootPath, standardDir, item)))

    consola.success('单帧压缩完成')

    consola.info('png开始合成apng')

    Assembler.assemble(
        path.resolve(rootPath, `${compressSingleFrameDir}/*.png`),
        'output.png',
        {
            frameDelay: 50,
            compression: Assembler.COMPRESS_7ZIP,
        },
    ).then(
        () => {
            consola.success('合成完成.')
            // remove(path.resolve(rootPath, standardDir))
            // remove(path.resolve(rootPath, detachDir))
            // remove(path.resolve(rootPath, compressSingleFrameDir))
        },
        (error: Error) => {
            console.error('assemble error', error)
        },
    )
    consola.info('合成中，时间较长，请耐心等待')
}

const hanldeApng = async (isStandard = false) => {
    consola.info('apng开始单帧分离')
    await detachApng(path.resolve(__dirname, './apng图片.png'))
    consola.info('分离完成')

    if (isStandard)
        await sizeStandard()

    await assembleApng(isStandard)
}

export {
    detachApng,
    assembleApng,
}

export default hanldeApng
