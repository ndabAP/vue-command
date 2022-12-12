import getOpts from 'getopts'

export const processQuery = async (query, commands) => {
  // First token is program
  const program = query.trim().split(' ')[0]

  // Check if command is regular command
  if (typeof commands[program] === 'function') {
    // Check if command is regular command
    await Promise.resolve(execute(program, query))
  }
}

const execute = (program, query, getOptsOptions) => {
  query = query.trim()
}
