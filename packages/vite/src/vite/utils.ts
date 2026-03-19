import process from 'node:process'

export function isDevFn(mode: string): boolean {
  return mode === 'development'
}

export function isProdFn(mode: string): boolean {
  return mode === 'production'
}

export function isReportMode(): boolean {
  return process.env.REPORT === 'true'
}
