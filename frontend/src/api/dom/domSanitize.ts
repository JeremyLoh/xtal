import DOMPurify from "dompurify"

function sanitizeHtmlString(htmlString: string) {
  const value = DOMPurify.sanitize(htmlString.trim())
  return removeImageFromHtmlString(value)
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

export { sanitizeHtmlString }
