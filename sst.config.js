"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web_1 = require("./stacks/Web");
exports.default = {
    config(_input) {
        return {
            name: "EvonyTKRTips",
            profile: "home",
            region: "us-east-2",
        };
    },
    stacks(app) {
        app.stack(Web_1.Web);
    }
};
