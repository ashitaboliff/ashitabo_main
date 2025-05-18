import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { createMetaData } from '@/utils/metaData'
import HomePageHeader from '@/components/home/HomePageHeader'
import { compileMDX } from 'next-mdx-remote/rsc' // Required for frontmatter parsing

const inter = Inter({ subsets: ['latin'] })

export async function metadata() {
  return createMetaData({
    title: 'あしたぼからのおしらせ',
    description: '信州大学工学部軽音サークルあしたぼからのおしらせです。',
    url: '/blogs',
  })
}

interface PostMeta {
  slug: string
  title: string
  createdAt?: string // Optional, depends on frontmatter
}

async function getAllPostsMeta(): Promise<PostMeta[]> {
  const postsDirectory = path.join(process.cwd(), 'src/app/blogs/_posts')
  let filenames: string[] = []
  try {
    filenames = fs.readdirSync(postsDirectory)
  } catch (error) {
    console.error('Error reading posts directory:', error)
    return [] // Return empty if directory doesn't exist or other error
  }

  const postsMeta: PostMeta[] = []

  for (const filename of filenames) {
    if (filename.endsWith('.mdx')) {
      const filePath = path.join(postsDirectory, filename)
      try {
        const source = fs.readFileSync(filePath, 'utf8')
        // We only need frontmatter here, so compileMDX is a bit heavy,
        // but it's the recommended way with next-mdx-remote/rsc to get frontmatter.
        // A lighter frontmatter parser could be used if performance becomes an issue.
        const { frontmatter } = await compileMDX<{ title: string; createdAt?: string }>({
          source,
          options: { parseFrontmatter: true },
        })
        postsMeta.push({
          slug: filename.replace(/\.mdx$/, ''),
          title: frontmatter.title || '無題の記事', // Fallback title
          createdAt: frontmatter.createdAt,
        })
      } catch (error) {
        console.error(`Error processing frontmatter for ${filename}:`, error)
        // Optionally add a post with an error state or skip it
        postsMeta.push({
          slug: filename.replace(/\.mdx$/, ''),
          title: `Error: ${filename}`,
        })
      }
    }
  }

  // Sort posts by createdAt date if available, newest first
  postsMeta.sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (a.createdAt) return -1 // a comes first
    if (b.createdAt) return 1  // b comes first
    return 0 // no change in order
  })

  return postsMeta
}

const BlogsPage = async () => {
  const posts = await getAllPostsMeta()

  return (
    <>
      <HomePageHeader />
      <div
        className={`container mx-auto flex flex-col items-center justify-center p-4 gap-y-3 ${inter.className}`}
      >
        <h1 className="text-3xl font-bold mb-6">おしらせ一覧</h1>
        {posts.length > 0 ? (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blogs/${post.slug}`} className="text-lg underline hover:text-secondary">
                  {post.title}
                  {post.createdAt && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({new Date(post.createdAt).toLocaleDateString('ja-JP')})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>まだお知らせはありません。</p>
        )}
        <Link className="btn btn-outline mt-8" href="/">
          戻る
        </Link>
      </div>
    </>
  )
}

export default BlogsPage
