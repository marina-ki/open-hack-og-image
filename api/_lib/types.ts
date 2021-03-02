export type FileType = 'png' | 'jpeg'
export type Theme = 'light' | 'dark'

export interface ParsedRequest {
  fileType: FileType
  text: string
  title: string[]
  tag: string
  theme: Theme
  md: boolean
  fontSize: string
}
