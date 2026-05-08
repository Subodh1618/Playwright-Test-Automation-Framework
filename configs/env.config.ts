type Env = 'test' | 'dev'

interface EnvConfig {
  testUrl: string
}

const environments: Record<Env, EnvConfig> = {
  test: { testUrl: 'https://google.com' },
  dev: { testUrl: '//dev url of the test website' },
}

export function getEnvConfig(env: Env = 'test'): EnvConfig {
  return environments[env]
}
