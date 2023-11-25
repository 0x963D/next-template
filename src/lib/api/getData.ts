// Example POST method implementation:
const getData = async ({ url, method, query }: { url: string; method: string; query?: string }): Promise<any> => {
  // Default options are marked with *
  const fetchUrl = query !== undefined ? url + "?" + query : url

  const response = await fetch(fetchUrl, {
    method: method.toUpperCase(), // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer" // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  })
  return await response.json() // parses JSON response into native JavaScript objects
}

export default getData
