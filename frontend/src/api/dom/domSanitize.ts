import DOMPurify from "dompurify"

function sanitizeHtmlString(htmlString: string) {
  const value = DOMPurify.sanitize(htmlString.trim(), {
    FORBID_TAGS: ["figure", "br", "img"],
  })
  return replaceHeadingTags(value)
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

export { sanitizeHtmlString }
