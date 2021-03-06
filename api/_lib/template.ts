
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'

const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

function getCss(theme: string, titleFontSize: number, tagFontSize: number) {
  let backgroundImage = 'linear-gradient(315deg, #f9c5d1 0%, #9795ef 74%)'
  if (theme === 'dark') {
    backgroundImage = 'linear-gradient(315deg, #9CCFEB 0%, #9795ef 74%)'
  }
  return `
    @import url('https://fonts.googleapis.com/css?family=M+PLUS+1p');

    body {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: ${backgroundImage};
    }
    .container {
      border: 4px white solid;
    
      border-top-left-radius: 40px;
      border-bottom-right-radius: 40px;
      // padding: 30px 8px 0px 30px;
      margin-right: 66px;
      margin-left: 66px;
      font-weight: bold;
      width:800px;
      height: 430px;
      position: relative;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    .wrapper {
      margin: 24px 40px;
      height: 382px;
      width: 720px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon {
      border-radius: 50%;
      position: absolute;
      bottom: -20px;
      right: -20px;
    }
    .heading {
        font-family: 'M PLUS 1p', 'Inter', sans-serif;
        font-style: normal;
        font-weight: 400;
        color: white;
        line-height: 1.3;
        text-align: center;
        word-break: break-all;
    }
    .title {
      font-weight: 720;
      font-size: ${titleFontSize}px;
    }
    .tag {
      padding-right: 100px;
      font-weight: 500;
      font-size: ${tagFontSize}px;
    }`
}

export function getHtml(parsedReq: ParsedRequest) {
  const {
    theme,
    text,
    tag,
    src,
  } = parsedReq

  const titleLength = text.length
  const tagLength = tag.length
  const wrapperWidth = 720
  const wrapperHeight = 382
  const fontRatio = 0.8 //tagのsizeがtitleのsizeの何倍か
  const lineHeight = 1.3
  const iconSpaceWidth = 40 //アイコンの分の横幅

  const maxFontSize = Math.floor(
    ((wrapperWidth * (wrapperHeight / lineHeight) - iconSpaceWidth ** 2) /
      (tagLength * fontRatio + titleLength)) **
      0.5
  )
  const maxTitleLineLength = Math.ceil(titleLength / Math.floor(wrapperWidth / maxFontSize))
  const maxTagLineLength = Math.ceil(
    tagLength / Math.floor((wrapperWidth - iconSpaceWidth) / (maxFontSize * fontRatio))
  )
  const titleFontSize = Math.floor(
    wrapperHeight / (maxTitleLineLength + maxTagLineLength * 0.8) / 1.3
  )

  const tagFontSize = Math.floor(titleFontSize * fontRatio)

  return `<!DOCTYPE html>
<html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${getCss(theme, titleFontSize, tagFontSize)}</style>
    <body>
      <div>
        <div class="container">
          <div class="wrapper">
            <div>
              <div class="heading title">${emojify(sanitizeHtml(text))}</div>

              <div class="heading tag">${emojify(sanitizeHtml(tag))}</div>
            </div>
          </div>
          <img
            class="icon"
            src=${src}
            width="110px"
          />
        </div>
      </div>
    </body>
</html>`
}
