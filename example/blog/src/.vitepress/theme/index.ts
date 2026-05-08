// Color theme — pick one, or comment out all and set CSS variables manually.
// Available: blue-theme, green-theme, purple-theme, amber-theme,
//            teal-theme, rose-theme, magenta-theme, monochrome-theme.
import "vitepress-theme-neptu-blog/blue-theme.css";

import Layout from "./Layout.vue";
import Theme from "vitepress-theme-neptu-blog";

// Pagefind search UI style overrides (fixes z-index and modal backdrop).
import "vitepress-theme-neptu-blog/pagefind-fix.css";

import "./styles.css";

export default {
  Layout,
  extends: Theme,
};
