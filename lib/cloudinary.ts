const CLOUDINARY_CLOUD_NAME = "dzs7toxdd"
const CLOUDINARY_UPLOAD_PRESET = "mehran_menu"

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  })

  const data = await response.json()
  return data.secure_url
}

export const getCloudinaryUrl = (publicId: string, options?: { width?: number; height?: number }) => {
  const transforms = []
  if (options?.width) transforms.push(`w_${options.width}`)
  if (options?.height) transforms.push(`h_${options.height}`)
  transforms.push("c_fill", "q_auto", "f_auto")

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms.join(",")}/${publicId}`
}
