import { defaultParser } from '../../src/library'

describe('library.js', () => {
  describe('defaultParser', () => {
    it('parses one program', () => {
      const parsedQuery = defaultParser('a')
      expect(parsedQuery).toStrictEqual(['a'])
    })

    it('parses multine queries', () => {
      const parsedQuery = defaultParser('a \\ --b \\ -c=d .')
      expect(parsedQuery).toStrictEqual(['a', '--b', '-c=d', '.'])
    })
  })
})
