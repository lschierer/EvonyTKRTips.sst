import type { SSTConfig } from "sst";
import { Web } from "./stacks/Web";

export default {
  config(_input) {
    return {
      name: "EvonyTKRTips",
      profile: "home",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app
        .stack(Web);
  }

} satisfies SSTConfig;
