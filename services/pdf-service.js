"use strict"

const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")

// ----------- create pdf file-------------------------//

exports.createPdf = () => {
  // console.log("body==", body)
  console.log("create pdf hit !")
  let pdfDoc = new PDFDocument()
  pdfDoc.pipe(fs.createWriteStream(path.join(__dirname, "../tmp/pdf/sm.pdf")))
  pdfDoc.text("My Sample PDF Document")
  pdfDoc.end()
}
