/**
 * 不是真实的 webpack 配置，仅为兼容 webstorm 和 intellij idea 代码跳转
 * ref: https://github.com/umijs/umi/issues/1109#issuecomment-423380125
 */
import { join } from 'path';

module.exports = {
  resolve: {
    alias: {
      '@': require('path').resolve(__dirname, 'src'),
      components: join(process.cwd(), "src", "components"),
    },
  },
};
