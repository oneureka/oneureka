export async function GET(request: Request) {
  const url = new URL(request.url)
  const isbn = url.searchParams.get('isbn')

  if (!isbn) {
    return new Response('Missing isbn parameter', { status: 400 })
  }

  const response = await fetch(`https://book.douban.com/isbn/${isbn}/`)
  if (!response.ok) {
    return new Response('Failed to fetch book page', { status: 502 })
  }

  const htmlText = await response.text()

  const parts = htmlText.split('<script type="application/ld+json">')
  if (parts.length < 2) {
    return new Response('Failed to parse book data', { status: 502 })
  }

  const [, text] = parts
  const [data] = text.split('</script>')

  if (!data) {
    return new Response('Empty book data', { status: 502 })
  }

  return new Response(data, {
    headers: { 'content-type': 'application/json' }
  })
}
