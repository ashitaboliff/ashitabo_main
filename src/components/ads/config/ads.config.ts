export interface AdPathConfig {
  pathPattern: string
  insertionEnabled: boolean
  insertEveryN: number
  adSlotId: string
  adClient: string
  targetSelector?: string
}

const DEFAULT_AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''

/**
 * @file ads.config.ts
 * 
 * このファイルでは、広告挿入の設定を定義するための配列 `adsConfigurations` をエクスポートしています。
 * 各設定は特定のパスパターンに基づいて広告を挿入するためのルールを指定します。
 * 
 * ## インターフェースの説明
 * 
 * ### AdPathConfig
 * - `pathPattern` (string): 広告を挿入する対象のURLパスパターンを指定します。
 *   - 例: `/blogs/**` は `/blogs` 以下のすべてのパスにマッチします。
 * - `insertionEnabled` (boolean): 広告挿入を有効にするかどうかを指定します。
 * - `insertEveryN` (number): 広告を挿入する間隔を指定します。例えば、`3` を指定すると、3つごとに広告が挿入されます。
 * - `adSlotId` (string): 広告スロットのIDを指定します。実際の広告スロットIDに置き換えて使用してください。
 * - `adClient` (string): 広告クライアントのIDを指定します。通常はデフォルトの広告クライアントを使用します。
 * - `targetSelector` (string | undefined): （オプション）広告を挿入するHTML要素を指定するためのCSSセレクタ。
 * 
 * ## 使用例
 * - `/blogs/**` のパスに対して、3つごとに広告を挿入する設定を追加。
 * - `/articles/*` のパスに対して、2つごとに広告を挿入する設定を追加。
 * 
 * 必要に応じて、他のパスやページに対する設定を追加してください。
 */
export const adsConfigurations: AdPathConfig[] = [
  {
    pathPattern: '/blogs/**', // Matches /blogs and any sub-paths
    insertionEnabled: true,
    insertEveryN: 3,
    adSlotId: '9275165268',
    adClient: DEFAULT_AD_CLIENT,
    targetSelector: 'div.prose > p',
  },
  {
    pathPattern: '/articles/*', // Matches /articles/any-slug but not /articles/any-slug/deeper
    insertionEnabled: true,
    insertEveryN: 2,
    adSlotId: 'YOUR_ARTICLE_LIST_AD_SLOT_ID', // Replace with your actual Ad Slot ID for article lists
    adClient: DEFAULT_AD_CLIENT,
  },
  // Add more configurations for other paths as needed
  // Example for a specific page:
  // {
  //   pathPattern: '/specific-page',
  //   insertionEnabled: true,
  //   insertEveryN: 1, // Insert after every main content block
  //   adSlotId: 'YOUR_SPECIFIC_PAGE_AD_SLOT_ID',
  //   adClient: DEFAULT_AD_CLIENT,
  //   targetSelector: '.main-content-block',
  // },
]

// Helper function to get config for a given path
export const getAdConfigForPath = (pathname: string): AdPathConfig | undefined => {
  for (const config of adsConfigurations) {
    const regexPattern = config.pathPattern
      .replace(/\*\*/g, '.*') // Replace ** with .* (matches any characters, including slashes)
      .replace(/\*/g, '[^/]*') // Replace * with [^/]* (matches any characters except slashes)
    const regex = new RegExp(`^${regexPattern}$`)
    if (regex.test(pathname)) {
      return config
    }
  }
  return undefined
}
