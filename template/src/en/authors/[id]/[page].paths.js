import { makeAuthorsParams } from 'vitepress-theme-neptu-blog/list-helpers/node';
import { PER_PAGE } from "../../../../../docs/src/.vitepress/config.js";
import getAllPosts from "../../../../../docs/src/en/getAllPosts.js";

export default {
  async paths() {
    return makeAuthorsParams(await getAllPosts(), PER_PAGE);
  },
};
