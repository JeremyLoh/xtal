import { JSDOM } from "jsdom"
import DOMPurify, { WindowLike } from "dompurify"

export function getSanitizedHtmlText(htmlText: string) {
  // sanitize HTML string and prevent XSS attacks
  const window = new JSDOM("").window
  const purify = DOMPurify(window as WindowLike)
  const cleanHtmlText = purify.sanitize(htmlText)
  return replaceHeadingTags(removeImageTags(cleanHtmlText))
}

function removeImageTags(htmlString: string) {
  // Removes all <img> tags. Same function used in frontend and backend
  let cleanHtmlString = htmlString.trim()
  const imageRegex = new RegExp(/<img\s+[^>]+\/?>/gi)
  while (imageRegex.test(cleanHtmlString)) {
    cleanHtmlString = cleanHtmlString.replace(imageRegex, "")
  }
  return cleanHtmlString
}

function replaceHeadingTags(htmlString: string, replacementTag: string = "p") {
  // Replace <h1> to <h6> tags in provided html string
  let outputHtmlString = htmlString.trim()
  const headingStartRegex = new RegExp(/<h[1-6]>/gi)
  const headingEndRegex = new RegExp(/<\/h[1-6]>/gi)
  while (headingStartRegex.test(outputHtmlString)) {
    outputHtmlString = outputHtmlString.replace(
      headingStartRegex,
      `<${replacementTag}>`
    )
  }
  while (headingEndRegex.test(outputHtmlString)) {
    outputHtmlString = outputHtmlString.replace(
      headingEndRegex,
      `</${replacementTag}>`
    )
  }
  return outputHtmlString
}
