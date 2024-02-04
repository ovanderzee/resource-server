import fs from 'fs';
const _logTitle = '---- stream statics ----------------\n';
export const logNote = (note) => {
    console.log(`${_logTitle}${note}`);
};
export const logError = (err) => {
    const message = JSON.stringify(err, null, 2);
    console.error(`${_logTitle}error: ${message}`);
};
export const throwError = (text) => {
    throw new Error(text);
};
export const isExistent = (path) => fs.existsSync(path);
export const isFile = (path) => fs.lstatSync(path).isFile();
export const isDirectory = (path) => fs.lstatSync(path).isDirectory();
