export function setBase64(data: string | any): String {
    const base64 = Buffer.from(data).toString('base64')
    return base64
}