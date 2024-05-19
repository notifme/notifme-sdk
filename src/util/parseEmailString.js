/* @flow */
export const parseEmailString = (emailString: string): { name: string, email: string } => {
  const match = emailString.match(/^(.*?)(?:\s*<(.+?)>)?$/)
  if (!match) {
    return { name: '', email: emailString.trim() }
  }
  return {
    name: match[1] ? match[1].trim() : '',
    email: match[2] ? match[2].trim() : emailString.trim()
  }
}
