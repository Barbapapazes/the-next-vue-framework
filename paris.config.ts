import type { NitroConfig } from 'nitropack'
import type { UserConfig } from 'vite'

interface ParisConfig {
  nitro?: NitroConfig
  vite?: UserConfig
}

export default {} satisfies ParisConfig
