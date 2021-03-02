
import { sanitizeHtml } from './sanitizer'
import { ParsedRequest } from './types'

const twemoji = require('twemoji')
const twOptions = { folder: 'svg', ext: '.svg' }
const emojify = (text: string) => twemoji.parse(text, twOptions)

function getCss(theme: string, titleFontSize: number, tagFontSize: number) {
  let background = 'white'
  let foreground = 'white'
  if (theme === 'dark') {
    background = 'black'
    foreground = 'white'
  }
  return `
    @import url('https://fonts.googleapis.com/css?family=M+PLUS+1p');

    body {
        background: ${background};
        height: 100vh;
        display: flex;
        // text-align: center;
        align-items: center;
        justify-content: center;
        // padding: 12px;
        // margin-bottom: 10px;
        background-image: linear-gradient(315deg, #f9c5d1 0%, #9795ef 74%);
    }
    code {
        color: #D400FF;
        font-family: 'Vera', 'M PLUS 1p';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }
    code:before, code:after {
        content: '\`';
    }
    .spacer {
        margin: 75px;
    }
    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
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
      height: 500px;
      position: relative;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    .wrapper {
      margin: 24px 40px;
      height: 452px;
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
        color: ${foreground};
        line-height: 1.3;
        text-align: center;
        word-break: break-all;
    }
    .title {
      font-weight: 700;
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
    text,
    tag,
  } = parsedReq

  const theme = "light"
  const titleLength = text.length
  const tagLength = tag.length
  const wrapperWidth = 452
  const wrapperHeight = 720
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
            src="https://images.microcms-assets.io/protected/ap-northeast-1:7b46820b-9e1b-4aab-ba38-e994b4176f3c/service/marina/media/nyan.jpg"
            width="110px"
          />
        </div>
      </div>
    </body>
</html>`
}
