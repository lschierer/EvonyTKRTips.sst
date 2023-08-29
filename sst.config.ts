import type { SSTConfig } from "sst";
import { Web } from "./stacks/Web";
import { Database } from "./stacks/Database";

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
        .stack(Database)
        .stack(Web);
  }

} satisfies SSTConfig;
