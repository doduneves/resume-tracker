/// <reference types="vite/client" />
/// <reference types="chrome" />

declare module "*.json" {
  const value: chrome.runtime.ManifestV3;
  export default value;
}
