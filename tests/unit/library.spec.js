import { defaultParser } from '../../src/library'

describe('library', () => {
  describe('defaultParser', () => {
    it('parses one program', () => {
      const parsedQuery = defaultParser('a')
      expect(parsedQuery).toStrictEqual(['a'])
    })

    describe('multiline queries', () => {
      it('parses one-backslashed multiline queries', () => {
        const parsedQuery = defaultParser('a \\ --b \\ -c=d .')
        expect(parsedQuery).toStrictEqual(['a', '--b', '-c=d', '.'])
      })

      it('ignores double backslashes', () => {
        const parsedQuery = defaultParser('a \\\\ --b \\ -c=d .')
        expect(parsedQuery).toStrictEqual(['a', '\\\\', '--b', '-c=d', '.'])
      })
    })
  })
})
