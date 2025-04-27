import sharp from "sharp"

const files = [
  "xtal-podcast-detail-page-play-podcast",
  "xtal-podcast-detail-page",
  "xtal-podcast-homepage",
  "xtal-radio-homepage",
]

files.forEach((f) => {
  sharp("../screenshots/" + f + ".png")
    .png({ quality: 83, compressionLevel: 9 })
    .toFile("./" + f + ".png")
})
