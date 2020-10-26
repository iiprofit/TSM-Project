export const getFileBuffer = (file: File): Promise<ArrayBuffer> => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reader.abort()
            reject(
                new DOMException(
                    `Problem parsing input file. - ${reader.error}`
                )
            )
        }

        reader.onload = () => {
            resolve(reader.result as ArrayBuffer)
        }

        reader.readAsArrayBuffer(file)
    })
}
