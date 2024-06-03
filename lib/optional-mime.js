import path from "path";
/* @ts-ignore */
import someContentTypes from './mime-light.json' with { type: "json" };
/*
    Select dependency or option
*/
let mime;
try {
    mime = await import('mime-types');
}
catch (err) {
    mime = {
        contentType: (name) => {
            const extention = path.extname(name).substring(1);
            const mimeType = someContentTypes[extention];
            return mimeType || 'text/plain';
        }
    };
}
export default mime;
