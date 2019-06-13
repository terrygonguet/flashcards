import * as sapper from "@sapper/app"

sapper
  .start({
    target: document.querySelector("#sapper"),
  })
  .then(() => {
    // load Quill
    let quillEl = document.createElement("script")
    let quillCss = document.createElement("link")

    quillEl.src = "quill.min.js"
    quillCss.rel = "stylesheet"
    quillCss.href = "quill.snow.css"

    document.head.append(quillEl)
    document.head.append(quillCss)
  })
