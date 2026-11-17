import packageJson from "../package.json";

import { paths } from "./routes/paths";

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: "Zenox Tech ",

  appVersion: packageJson.version,

  serverUrl:
    process.env.NEXT_PUBLIC_SERVER_URL ??
    "https://venturekartapi.walkershive.com.np/api/frontend/",

  assetsDir:
    process.env.NEXT_PUBLIC_ASSETS_DIR ?? "https://venturekartapi.walkershive.com.np/",

  vendorToken: "3TUGo2H8m3YnfOO1o94BUhyNfGj0otKiekNpPSeEvHelt4JntQq2oijwS7I5",

  vendorId: process.env.NEXT_PUBLIC_VENDOR_ID ?? "1",

  auth: {
    redirectPath: paths.home,
  },

  genericErrorMessage: "Oops! Something went wrong. Please try again.",

  pusher: {
    key: "c35c0621c3312fb4fe89",
    cluster: "ap2",
  },
};