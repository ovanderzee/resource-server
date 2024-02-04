import fs from 'fs';

const _logTitle = '---- stream statics ----------------\n'

export const logNote = (note: string): void => {
    console.log(`${_logTitle}${note}`)
}

export const logError = (err: unknown): void => {
    const message = JSON.stringify(err, null, 2)
    console.error(`${_logTitle}error: ${message}`)
}

export const throwError = (text: string): void => {
    throw new Error(text)
}

export const isExistent = (path: string): boolean => fs.existsSync(path)

export const isFile = (path: string): boolean => fs.lstatSync(path).isFile();

export const isDirectory = (path: string): boolean => fs.lstatSync(path).isDirectory();
