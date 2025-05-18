import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'
import { LuCalendarSync, LuCalendar } from 'react-icons/lu'
import { createMetaData } from '@/utils/metaData'
import HomePageHeader from '@/components/home/HomePageHeader' // Assuming this is a shared header

// Define the expected shape of the frontmatter
interface Frontmatter {
  title: string
  description: string
  createdAt: string
  updatedAt: string
  // Add other frontmatter fields if needed
}

// Helper function to get blog post data
async function getPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/app/blogs/_posts')
  const filePath = path.join(postsDirectory, `${slug}.mdx`)

  try {
    const source = fs.readFileSync(filePath, 'utf8')
    const { content, frontmatter } = await compileMDX<Frontmatter>({
      source,
      options: { parseFrontmatter: true },
      // You can pass components here if needed, e.g.,
      // components: { MyCustomComponent },
    })
    return { content, frontmatter, slug }
  } catch (error) {
    console.error(`Error reading or compiling MDX for slug ${slug}:`, error)
    return null // Or throw an error to be caught by Next.js error handling
  }
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src/app/blogs/_posts')
  try {
    const filenames = fs.readdirSync(postsDirectory)
    return filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map((filename) => ({
        slug: filename.replace(/\.mdx$/, ''),
      }))
  } catch (error) {
    console.error('Error reading posts directory for generateStaticParams:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) {
    return createMetaData({
      title: '記事が見つかりません',
      description: '指定されたブログ記事は見つかりませんでした。',
      url: `/blogs/${params.slug}`,
    })
  }
  return createMetaData({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    url: `/blogs/${params.slug}`,
  })
}

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  const post = await getPost(params.slug)

  if (!post) {
    // Handle post not found, e.g., by redirecting or showing a 404 component
    // For now, just returning a simple message
    return (
      <>
        <HomePageHeader />
        <div className="container mx-auto bg-white p-4 pb-8 rounded-lg text-center">
          <h1 className="text-3xl font-bold mt-8">記事が見つかりません</h1>
          <p className="mt-4">指定されたブログ記事は見つかりませんでした。</p>
          <a className="btn btn-outline mt-8" href="/blogs">
            ブログ一覧に戻る
          </a>
        </div>
      </>
    )
  }

  return (
    <>
      <HomePageHeader />
      <div className="container mx-auto bg-white p-4 pb-8 rounded-lg">
        <article className="prose lg:prose-xl max-w-none"> {/* Apply Tailwind Typography for styling */}
          <h1 className="text-3xl font-bold text-center mt-4">
            {post.frontmatter.title}
          </h1>
          <div className="flex flex-col items-end mb-4">
            {post.frontmatter.updatedAt && (
              <div className="text-sm text-gray-600 mt-2 flex flex-row items-center gap-x-1">
                <LuCalendarSync />
                更新日: {post.frontmatter.updatedAt}
              </div>
            )}
            {post.frontmatter.createdAt && (
              <div className="text-sm text-gray-600 flex flex-row items-center gap-x-1">
                <LuCalendar />
                作成日: {post.frontmatter.createdAt}
              </div>
            )}
          </div>
          <div className="mt-8">{post.content}</div>
        </article>
        <div className="flex flex-row justify-center mt-8 gap-5">
          <a className="btn btn-outline" href="/blogs">
            ブログ一覧に戻る
          </a>
        </div>
      </div>
    </>
  )
}

export default BlogPostPage
