import Tobii from "@midzer/tobii";
import "@midzer/tobii/dist/tobii.min.css";
import { tobiiLightboxPlugin } from "vitepress-theme-neptu-blog/tobiiLightboxPlugin.js";
import "vitepress-theme-neptu-blog/blue-theme.css";
import Layout from "./Layout.vue";
import Theme from "vitepress-theme-neptu-blog";
import "vitepress-theme-neptu-blog/tw-styles.css";
import "vitepress-theme-neptu-blog/pagefind-fix.css";

import "./styles.css";

export default {
  Layout,
  extends: Theme,
  enhanceApp(ctx) {
    tobiiLightboxPlugin(ctx, Tobii);
  },
};
