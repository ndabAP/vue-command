import { defaultParser } from '../../src/library'

describe('library', () => {
  describe('defaultParser', () => {
    it('parses one argument', () => {
      const parsedQuery = defaultParser('a')
      expect(parsedQuery).toStrictEqual(['a'])
    })

    it('parses multiple arguments', () => {
      const parsedQuery = defaultParser('a --b c=d')
      expect(parsedQuery).toStrictEqual(['a', '--b', 'c=d'])
    })
  })
})
