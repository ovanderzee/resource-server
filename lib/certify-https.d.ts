/// <reference types="node" />
declare const getSecureOptions: () => {
    key: Buffer;
    cert: Buffer;
};
export default getSecureOptions;
