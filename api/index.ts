export async function GET(request: Request) {
  const url = new URL(request.url)
  const isbn = url.searchParams.get('isbn')
  const response = await fetch(`https://book.douban.com/isbn/${isbn}/`)

  const _location = response.headers.get('location')
  const _bookId = (_location?.match(/\d+/) || '')[0]

  return new Response(await fetchBook(_bookId))
}

async function fetchBook(bookId: string) {
  const response = await fetch(`https://book.douban.com/subject/${bookId}/`)
  const htmlText = await response.text()
  const [_1, text] = htmlText.split('<script type="application/ld+json">')
  const [data, _2] = text.split('</script>')

  return JSON.parse(data)
}
