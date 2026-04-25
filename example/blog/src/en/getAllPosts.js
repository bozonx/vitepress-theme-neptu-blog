import path from "path";
import { loadPostsData } from "vitepress-theme-neptu-blog/loadPosts.js";

const localeDir = path.dirname(import.meta.url.replace("file://", ""));
const config = globalThis.VITEPRESS_CONFIG;

export default function () {
  return loadPostsData(localeDir, config);
}
