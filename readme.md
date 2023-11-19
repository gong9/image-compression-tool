
#### zelda-image-compression

> 项目从之前的zelda 项目抽离于此， 原项目地址：https://github.com/gong9/zelda

由于有时候我们为了方便，不会将所有的图片资源都上传到 cdn 服务器，而是放进项目中。但是又由于图片资源大小问题导致我们的项目越来越大

此工具就是用来压缩项目暂存区的图片资源

目前主要支持 jpg、png、webp

#### usage

```bash
npm i image-compression-tool -g
```

git add . 之后执行

```bash
compression-tool
```

git commit ...

后续：

> 暂时不支持apng格式的图片压缩

针对于 apng 格式的图片，目前支持 apng 拆解成 png 序列帧，png 序列帧合成 apng

但是由于 apng 拆解对导致图片的尺寸发生一些微笑变化，目前暂不可使用。故针对于 apng 的压缩可以直接给出 png 序列帧，在交由`assembleApng` 方法压缩

但是此种方式因为需要 png 序列帧资源，比较不不方便。所以后续计划写成 electron 桌面应用，方便设计同学直接生成 apng

