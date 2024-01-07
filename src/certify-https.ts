import * as fs from 'fs'
import { execSync } from 'child_process'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const keyFile = resolve(__dirname, '.localhost.key')
const crtFile = resolve(__dirname, '.localhost.crt')

const makeCertificate = `openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 30 -subj '/CN=localhost' -keyout ${keyFile} -out ${crtFile}`
const outputValidity = `openssl x509  -noout -enddate -in ${crtFile}`

const readCertificate = (): {key: Buffer, cert: Buffer} => {
    let key = fs.readFileSync(keyFile)
    let cert = fs.readFileSync(crtFile)
    return { key, cert }
}

const getSecureOptions = (): {key: Buffer, cert: Buffer} => {
    let secureOptions: {key: Buffer, cert: Buffer}

    try {
        secureOptions = readCertificate()
        const outputValidation = execSync(outputValidity).toString()
        const endDate = new Date(outputValidation.split('=')[1])

        const timeLeft = endDate.getTime() - Date.now()
        if (timeLeft < 0) {
            throw new Error('certificate expired')
        }
        return secureOptions
    }
    catch(error) {
        // certificate did not exist or was invalid
        execSync(makeCertificate, {stdio: 'ignore'})
        secureOptions = readCertificate()
        return secureOptions
    }
}

export default getSecureOptions
