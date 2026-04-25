import path from "path";
import { POSTS_DIR } from "vitepress-theme-neptu-blog/constants.js";
import { loadPostsData } from "vitepress-theme-neptu-blog/loadPosts.js";

const config = globalThis.VITEPRESS_CONFIG;
const localeDir = path.dirname(import.meta.url.replace("file://", ""));

export default {
  watch: [`./${POSTS_DIR}/*.md`],
  async load(watchedFiles) {
    return {
      posts: await loadPostsData(
        localeDir,
        config,
        process.env.NODE_ENV !== "production"
      ),
    };
  },
};
