export async function setBase64(data: string | any): Promise<String> {
    const base64 = await Buffer.from(data).toString('base64')
    return base64
}