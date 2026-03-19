import process from 'node:process'
import { loadEnv } from 'vite'

const defaultEnv = {
  VITE_PORT: 3000,
  VITE_APP_NAME: 'Frontend Application',
  VITE_APP_VERSION: '1.0.0',
  VITE_BASE_URL: '',
  VITE_API_BASE_URL: '',
  VITE_OUTPUT_DIR: 'dist',
  VITE_DROP_CONSOLE: 'true',
  VITE_BUILD_COMPRESS: 'none'
}

function wrapperEnv(envConf: Record<string, any>): ViteEnv {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realValue = typeof envConf[envName] === 'string' ? envConf[envName].replace(/\\n/g, '\n') : envConf[envName]
    realValue = realValue === 'true' ? true : realValue === 'false' ? false : realValue

    if (envName === 'VITE_PORT') {
      realValue = Number(realValue)
    }
    if (envName === 'VITE_PROXY') {
      try {
        realValue = JSON.parse(realValue)
      } catch {}
    }
    ret[envName] = realValue
    process.env[envName] = String(realValue)  // Bug Fix #1：String() 强制转换
  }

  return ret
}

export function useEnv(mode: string, envDir: string, prefixes?: string | string[]): ViteEnv {
  const env = Object.assign(defaultEnv, loadEnv(mode, envDir, prefixes))
  return wrapperEnv(env)
}
