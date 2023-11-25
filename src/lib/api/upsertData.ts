// Example POST method implementation:
const upsertData = async ({ url, method, payload }: { url: string; method: string; payload: any }): Promise<any> => {
  // Default options are marked with *
  const response = await fetch(url, {
    method: method.toUpperCase(), // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(payload) // body data type must match "Content-Type" header
  })
  return await response.json() // parses JSON response into native JavaScript objects
}

export default upsertData
