// e-room テスト専用の ESM resolve フック。
// node --import tsx --test には画像/CSS ローダが無いため、次を差し替える:
//   - 静的画像 import（photos.ts が読む .jpg/.jpeg 等）を軽量な
//     StaticImageData 相当スタブへ写像する（実ファイルを読まずに済ませる）。
//   - .css を空モジュールへ落とす（将来の依存追加で壊れないため）。
//   - next/image を CJS/ESM interop 差異を吸収する既存シムへ正規化する
//     （renderToStaticMarkup の "Element type is invalid" を防ぐ）。
// webpack ビルドには一切影響しない（テスト時のみ register される）。

const IMAGE_STUB =
  'data:text/javascript,' +
  encodeURIComponent(
    "export default { src: '/e-room-stub.jpg', height: 100, width: 100, blurDataURL: '' }",
  )

const EMPTY_MODULE = 'data:text/javascript,export default {}'

const nextImageShim = new URL(
  '../../../components/__testShims__/nextImage.mjs',
  import.meta.url,
).href

export async function resolve(specifier, context, nextResolve) {
  if (/\.(jpe?g|png|webp|gif|avif|svg)$/i.test(specifier)) {
    return { url: IMAGE_STUB, shortCircuit: true }
  }
  if (specifier.endsWith('.css')) {
    return { url: EMPTY_MODULE, shortCircuit: true }
  }
  if (
    specifier === 'next/image' &&
    !(context.parentURL || '').includes('__testShims__')
  ) {
    return { url: nextImageShim, shortCircuit: true }
  }
  return nextResolve(specifier, context)
}
