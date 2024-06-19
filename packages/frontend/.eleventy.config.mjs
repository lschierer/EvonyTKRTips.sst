// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (eleventyConfig) {
  return {
    dir: {
      input: '../../content/',
      includes: 'lib/',
      layouts: 'layouts/',
      data: 'data',
      output: 'dist',
    },
  };
}
