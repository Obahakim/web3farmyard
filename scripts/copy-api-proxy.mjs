import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const source = resolve(process.cwd(), 'api-proxy.php')
const outputDir = resolve(process.cwd(), 'out')
const destination = resolve(outputDir, 'api-proxy.php')

if (!existsSync(source)) {
  throw new Error('api-proxy.php is missing from the project root.')
}
if (!existsSync(outputDir)) {
  throw new Error('Next.js static export did not create the out/ directory.')
}

copyFileSync(source, destination)
console.log('Copied hardened PHP API proxy into out/api-proxy.php')
