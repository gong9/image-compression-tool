
#### zelda-image-compression

> 项目从之前的zelda 项目抽离于此， 原项目地址：https://github.com/gong9/zelda

由于有时候我们为了方便，不会将所有的图片资源都上传到 cdn 服务器，而是放进项目中。但是又由于图片资源大小问题导致我们的项目越来越大

此工具就是用来压缩项目暂存区的图片资源

目前主要支持 jpg、png、webp

#### usage

因为有几个二进制文件需要走国内镜像

使用pnpm

推荐使用pnpm hooks

方式一： 推荐

根目录创建.pnpmfile.cjs文件

```cjs
module.exports = {
    hooks: {
        readPackage(packageJson) {

            if (packageJson.dependencies && packageJson.dependencies['bin-wrapper']) {
                console.log('当前依赖名称：',packageJson.name, '需要转化');
                packageJson.dependencies['bin-wrapper'] = 'npm:bin-wrapper-china';
            }
            return packageJson;
        },

    }
};
```

有些时候可能sharp依赖也无法安装，可以添加.npmrc文件

```
registry=https://registry.npm.taobao.org
sharp_binary_host=https://npm.taobao.org/mirrors/sharp
sharp_libvips_binary_host=https://npm.taobao.org/mirrors/sharp-libvips
```

方式二： 不推荐（有时不生效）
在packagejson下配置overrides

```json
{
  "pnpm": {
    "overrides": {
      "*bin-wrapper": "npm:bin-wrapper-china"
    }
  }
}
```

使用yarn则需要配置（不推荐，因个人常用pnpm没有经过yarn的测试。如果此方法不能成功压缩可自行尝试相关hook方案或者提个issues）
```json
{
  "resolutions": {
    "**/bin-wrapper": "npm:bin-wrapper-china"
  }
}
```
https://github.com/yarnpkg/rfcs/blob/master/implemented/0000-selective-versions-resolutions.md

```bash
pnpm add image-compression-tool 
```

git add . 之后执行

```bash
npx compression-tool
```

git commit ...

如若不行，删除node_modules和lock文件再次执行pnpm i

后续：

> 暂时不支持apng格式的图片压缩

针对于 apng 格式的图片，目前支持 apng 拆解成 png 序列帧，png 序列帧合成 apng

但是由于 apng 拆解对导致图片的尺寸发生一些微笑变化，目前暂不可使用。故针对于 apng 的压缩可以直接给出 png 序列帧，在交由`assembleApng` 方法压缩

但是此种方式因为需要 png 序列帧资源，比较不不方便。所以后续计划写成 electron 桌面应用，方便设计同学直接生成 apng

