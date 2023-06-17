import { NitroConfig } from "nitropack";
import { UserConfig } from "vite";

interface ParisConfig {
  nitro?: NitroConfig,
  vite?: UserConfig,
}

export default {} satisfies ParisConfig
