import fs from 'fs-extra'
import sharp from 'sharp'

/**
 * get png dimensions
 * @param path
 */
export const getDimensions = async (path: string) => {
    return await sharp(path).metadata()
}

export const getAllFilesName = async (path: string) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err)
                reject(err)

            resolve(files)
        })
    }) as Promise<string[]>
}

export const getFirstFrame = async (path: string) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if (err)
                reject(err)

            if (files.length > 0)
                resolve(files[0])

            else
                resolve('')
        })
    }) as Promise<string>
}

export const resetSize = (inputDirectory: string, outputDirectory: string, targetWidth?: number, targetHeight?: number) => {
    return new Promise((resolve, reject) => {
        fs.readdir(inputDirectory, (err, files) => {
            if (err)
                reject(err)

            files.forEach((file, index) => {
                if (file.endsWith('.png')) {
                    sharp(`${inputDirectory}/${file}`)
                        .resize(targetWidth, targetHeight)
                        .png()
                        .toFile(`${outputDirectory}/${file}`, (err) => {
                            if (err)
                                throw err

                            if (index === files.length - 1)
                                resolve(true)
                        })
                }
            })
        })
    })
}
