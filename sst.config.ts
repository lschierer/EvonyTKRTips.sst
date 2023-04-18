import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "EvonyTKRTips",
      profile: "home",
      region: "us-east-2",
    };
  },
  stacks(app) {
    app.stack(API);
  }
} satisfies SSTConfig;
