import { GatsbyNode } from 'gatsby';
import webpack from 'webpack';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = async ({ actions}) => {
  actions.setWebpackConfig({
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
        resource.request = resource.request.replace(/^node:/, "");
      })
    ],
    resolve: {
      fallback: {
        crypto: false,
      },
    },
  })
}
