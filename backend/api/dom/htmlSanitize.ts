import { JSDOM } from "jsdom"
import DOMPurify, { WindowLike } from "dompurify"

export function getSanitizedHtmlText(htmlText: string) {
  // sanitize HTML string and prevent XSS attacks
  const window = new JSDOM("").window
  const purify = DOMPurify(window as WindowLike)
  const cleanHtmlText = purify.sanitize(htmlText)
  return cleanHtmlText
}
