/* @flow */

export default function dedupe (array: Array<any>): Array<any> {
  return array.filter((element, position) => array.indexOf(element) === position)
}
