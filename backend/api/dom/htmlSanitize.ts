import { JSDOM } from "jsdom"
import DOMPurify, { WindowLike } from "dompurify"

export function getSanitizedHtmlText(htmlText: string) {
  // sanitize HTML string and prevent XSS attacks
  const window = new JSDOM("").window
  const purify = DOMPurify(window as WindowLike)
  const cleanHtmlText = purify.sanitize(htmlText)
  return removeImageFromHtmlString(cleanHtmlText)
}

function removeImageFromHtmlString(htmlString: string) {
  // Removes all <img> tags. Same function used in frontend and backend
  let cleanHtmlString = htmlString.trim()
  const imageRegex = new RegExp(/<img\s+[^>]+\/?>/gi)
  while (imageRegex.test(cleanHtmlString)) {
    cleanHtmlString = cleanHtmlString.replace(imageRegex, "")
  }
  return cleanHtmlString
}
