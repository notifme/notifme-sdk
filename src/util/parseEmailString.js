/* @flow */
export const parseEmailString = (emailString: string): { name?: string, email: string } => {
  // Regular expression to match the name and email parts
  const match = emailString.match(/^(.*?)(?:\s*<(.+?)>)?$/)

  // If no match, return the email string as the email without a name
  if (!match) {
    return { email: emailString.trim() }
  }

  // Extract and trim the name and email parts
  const name = match[1] ? match[1].trim() : ''
  const email = match[2] ? match[2].trim() : emailString.trim()

  // Return the object conditionally including the name
  if (name) {
    return { name, email }
  } else {
    return { email }
  }
}
