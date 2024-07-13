// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'evonytkrtips',
      profile: 'home',
      buildCommand: 'pnpm run build',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          region: 'us-east-2',
        },
      },
    };
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  async run() {
    const EvonyVpc = new sst.aws.Vpc('EvonyVpc', {
      transform: {
        vpc: {
          assignGeneratedIpv6CidrBlock: true,
          enableDnsHostnames: true,
          enableDnsSupport: true,
        },
      },
    });

    const EvonyCluster = new sst.aws.Cluster('EvonyTKRTips', {
      vpc: EvonyVpc,
    });

    EvonyCluster.addService('EvonyService', {
      scaling: {
        min: 1,
        max: 2,
      },
      public: {
        ports: [
          {
            listen: '3000/http',
          },
        ],
      },
    });
  },
});
