import { createTransport } from "nodemailer"

const sendVerificationRequest = async (params: {
  identifier: string
  url: string
  provider: {
    server: string
    from: string
  }
  server?: string
}): Promise<void> => {
  const { identifier, url, provider } = params
  const { host } = new URL(url)
  const transport = createTransport(provider.server)
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: text({ url, host }),
    html: html({ url, host })
  })
  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length > 0) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
const html = (params: { url: string; host: string }): string => {
  const { url, host } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  const brandColor = "#346df1"
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff"
  }

  return `
<body style="background: ${color.background};">


<table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%">
  <tbody>
      <tr>
          <td align="center" valign="top" style="vertical-align:top;line-height:1;padding:48px 32px">
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px">
                  <tbody>
                      <tr>
                          <td align="left" valign="top" style="vertical-align:top;line-height:1;padding:16px 32px">
                              <p style="padding:0px;margin:0px;font-family:Helvetica,Arial,sans-serif;color:#000000;font-size:24px;line-height:36px">
                                <img width="128" src="https://ipfs.io/ipfs/QmbCXCJAFxeSmnnbXCfiEaXdJRkgXdYm9hJBu8oWWHHNjH?filename=new-yolk-logo-egg.png" alt="newyolk.io Logo" style="max-width:128px;width:128px" class="CToWUd" data-bit="iit">
                              </p>
                          </td>
                      </tr>
                  </tbody>
              </table>
              <table cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;border-collapse:separate">
                  <tbody>
                      <tr>
                          <td align="left" valign="top" bgcolor="#fff" style="vertical-align:top;line-height:1;background-color:${color.background};border-radius:0px">
                              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;border-collapse:separate">
                                  <tbody>
                                      <tr>
                                          <td align="left" valign="top" bgcolor="${color.background}" style="vertical-align:top;line-height:1;padding:32px 32px 48px;background-color:${color.background};border-radius:0px">
                                            <h1 align="left" style="padding:0px;margin:0px;font-style:normal;font-family:Helvetica,Arial,sans-serif;font-size:32px;line-height:39px;color:#000000;font-weight:bold">Sign in to <a href="${url}">${escapedHost}</a></h1>
                                            <p align="left" style="padding:0px;margin:16px 0px 0px;font-family:Helvetica,Arial,sans-serif;color:#000000;font-size:14px;line-height:21px">Click the button below to sign in to <a href="{url}">${escapedHost}</a>. </p>
                                              <table cellpadding="0" cellspacing="0" border="0" width="auto" style="width:auto;font-size:14px;font-weight:normal;background-color:#da532c;color:#ffffff;border-radius:8px;border-collapse:separate;margin:32px 0px 32px 0px">
                                                  <tbody>
                                                      <tr>
                                                          <td align="center" valign="top" bgcolor="#DA532C" style="vertical-align:top;line-height:1;text-align:center;font-family:Helvetica,Arial,sans-serif;border-radius:8px">
                                                            <a href="${url}" style="display:inline-block;box-sizing:border-box;text-decoration:none;margin:0px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:normal;background-color:#da532c;color:#ffffff;border-radius:8px;border:1px solid #da532c;padding:15px 24px">Sign in to ${escapedHost}</a>
                                                          </td>
                                                      </tr>
                                                  </tbody>
                                              </table>
                                             <p style="padding:0px;margin:32px 0px 0px;;font-family:Helvetica,Arial,sans-serif;color:#000000;font-size:14px;line-height:21px"><b>Didn't request this?</b> </p>
                                            <p style="padding:0px;margin:4px 0px 0px;;font-family:Helvetica,Arial,sans-serif;color:#000000;font-size:14px;line-height:21px">If you didn't make this request, you can safely ignore this email.</p>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>
      </tr>
  </tbody>
</table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
const text = ({ url, host }: { url: string; host: string }): string => {
  return `Sign in to ${host}\n${url}\n\n`
}

export default sendVerificationRequest
