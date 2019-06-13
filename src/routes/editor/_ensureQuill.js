export default function ensureQuill() {
  if (!document.querySelector("#quillSrc")) {
    return new Promise((resolve, reject) => {
      // load Quill
      let src = false,
        css = false
      let check = () => src && css && resolve()
      let quillEl = document.createElement("script")
      let quillCss = document.createElement("link")

      quillEl.onload = () => {
        src = true
        check()
      }
      quillCss.onload = () => {
        css = true
        check()
      }
      quillEl.onerror = reject
      quillCss.onerror = reject

      quillEl.src = "quill.min.js"
      quillEl.id = "quillSrc"
      quillCss.rel = "stylesheet"
      quillCss.href = "quill.snow.css"

      document.head.append(quillEl)
      document.head.append(quillCss)
    })
  } else return Promise.resolve()
}
