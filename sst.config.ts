import type { SSTConfig } from "sst";
import { Web } from "./stacks/Web";
import { Api } from "./stacks/Api";
import { Database } from "./stacks/Database";

export default {
  config(_input) {
    return {
      name: "EvonyTKRTips",
      profile: "default",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app
        .stack(Database)
        .stack(Api)
        .stack(Web);
  }

} satisfies SSTConfig;
