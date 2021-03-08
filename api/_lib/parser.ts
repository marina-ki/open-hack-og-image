import { IncomingMessage } from 'http'
import { parse } from 'url'
import { ParsedRequest } from './types'

export function parseRequest(req: IncomingMessage) {
  console.log('HTTP ' + req.url)
  const { pathname, query } = parse(req.url || '/', true)
  const { fontSize, theme, md, title, tag, src } = query || {}

  if (Array.isArray(fontSize)) {
    throw new Error('Expected a single fontSize')
  }
  if (Array.isArray(theme)) {
    throw new Error('Expected a single theme')
  }
  if (Array.isArray(tag)) {
    throw new Error('Expected a single tag')
  }
  if (Array.isArray(src)) {
    throw new Error('Expected a single tag')
  }

  const arr = (pathname || '/').slice(1).split('.')
  const apiVersion = 'apiv2/'
  let extension = ''
  let text = ''
  if (arr.length === 0) {
    text = ''
  } else if (arr.length === 1) {
    text = arr[0].replace(apiVersion, '')
  } else {
    extension = arr.pop() as string
    text = arr.join('.').replace(apiVersion, '')
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === 'jpeg' ? extension : 'png',
    title: getArray(title),
    tag: decodeURIComponent(tag),
    text: decodeURIComponent(text),
    theme: theme === 'dark' ? 'dark' : 'light',
    md: md === '1' || md === 'true',
    fontSize: fontSize || '60px',
    src: decodeURIComponent(src),
  }
  return parsedRequest
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === 'undefined') {
    return []
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray
  } else {
    return [stringOrArray]
  }
}
