import { JSDOM } from "jsdom"
import DOMPurify, { WindowLike } from "dompurify"

export function getSanitizedHtmlText(htmlText: string) {
  // sanitize HTML string and prevent XSS attacks
  const window = new JSDOM("").window
  const purify = DOMPurify(window as WindowLike)
  const cleanHtmlText = purify.sanitize(htmlText, {
    FORBID_TAGS: ["figure", "br", "img"],
  })
  return replaceHeadingTags(cleanHtmlText)
}

function replaceHeadingTags(htmlString: string, replacementTag: string = "p") {
  // Replace <h1> to <h6> tags in provided html string
  const headingStartRegex = new RegExp(/<h[1-6]>/gi)
  const headingEndRegex = new RegExp(/<\/h[1-6]>/gi)

  return htmlString
    .trim()
    .replaceAll(headingStartRegex, `<${replacementTag}>`)
    .replaceAll(headingEndRegex, `</${replacementTag}>`)
}
