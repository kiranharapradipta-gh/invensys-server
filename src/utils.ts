import { writeFile } from "fs/promises"

export const saveimage = async (data: any) => {
  // saving image
  const buffer = Buffer.from(data)
  const filename = `${new Date().getTime()}.jpg`
  const filepath = `${process.cwd()}/src/uploads/${filename}`

  await writeFile(filepath, buffer)

  return filename
}