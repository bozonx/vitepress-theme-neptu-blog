import { makeMonthsParams } from "vitepress-theme-neptu-blog/makeListParams.js";
import getAllPosts from "../../../getAllPosts.js";

export default {
  async paths() {
    return makeMonthsParams(await getAllPosts());
  },
};
