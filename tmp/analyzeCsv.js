const fs = require("fs")
const path = require("path")

const raw = fs.readFileSync(path.join(__dirname, "..", "_full-booklist.csv"), "utf8")
const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
if (lines.length && /^Book,ISBN$/i.test(lines[0])) {
  lines.shift()
}

const entries = lines.map((line) => {
  const idx = line.lastIndexOf(",")
  const left = idx >= 0 ? line.slice(0, idx) : line
  const right = idx >= 0 ? line.slice(idx + 1) : ""
  const isbn = right.replace(/^"|"$/g, "").trim()
  const titleAuthor = left.replace(/^"|"$/g, "").trim()
  const dashIdx = titleAuthor.lastIndexOf(" - ")
  let title = titleAuthor
  let author = "Unknown"
  if (dashIdx >= 0) {
    title = titleAuthor.slice(0, dashIdx).trim()
    author = titleAuthor.slice(dashIdx + 3).trim()
  }
  return { raw: line, title, author, isbn, hasDash: dashIdx >= 0 }
})

const missingDash = entries.filter((entry) => !entry.hasDash)
const missingIsbn = entries.filter((entry) => !entry.isbn)

console.log("Total entries", entries.length)
console.log("Missing dash", missingDash.length)
console.log(missingDash.slice(0, 10))
console.log("Missing ISBN", missingIsbn.length)
console.log(missingIsbn.slice(0, 10))
