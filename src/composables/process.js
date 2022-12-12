import getOpts from 'getopts'

export const processQuery = async (query, commands, getOptsOptions) => {
  if (query === '') {

  }

  // First token is program
  const program = query.trim().split(' ')[0]

  // Check if command exists
  if (typeof commands[program] === 'function') {
    await Promise.resolve(execute(program, query))
  }
}

const execute = (program, query, getOptsOptions) => {
  console.debug(program, query)
  query = query.trim()
}
