import { GameImage } from 'src/types/Game'

export const formatCover = (image: string): string => {
  return image.replace('t_thumb', 't_cover_big_2x')
}

export const formatScreenshots = (images: GameImage[]): string[] => {
  const newImages = []

  images.map((item) => {
    newImages.push(formatCover(item.url))
  })

  return newImages
}
