import SideBarCategoryLists from '@/app/components/molecules/CategoryList'
import Sidebar from '@/app/components/templates/Sidebar'
import type { Categories } from '@/types/categories'
import { marked } from 'marked'
import Link from 'next/link'
const stripMarkdown = async (markdown: string): Promise<string> => {
  const html = await marked(markdown)
  const text = html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
  return text.trim()
}

interface BlogGridProps {
  blogData: any
  label: typeof Categories | string[] | undefined | string
}

const BlogGrid: React.FC<BlogGridProps> = async ({ blogData, label }) => {
  return (
    <>
      <section className="container mx-auto">
        <div className="flex items-center justify-center p-4">
          <span className="rounded px-4 pb-2 pt-1 text-3xl font-medium text-black">
            {label}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {await Promise.all(
            blogData.map(async (post: any, index: number) => {
              const strippedContent = (await stripMarkdown(post.content))
                // カードの大きさに応じて要変更
                .substring(0, 80)

              return (
                <div
                  key={index}
                  className="relative mx-auto max-w-lg transform rounded border bg-white p-5 shadow-lg transition-transform duration-300 hover:scale-105"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <h1 className="mb-2 text-xl font-bold">{post.title}</h1>
                    <div className="relative"></div>
                    <div className="mb-2 flex items-center space-x-2 text-sm">
                      <span>{post.date}</span>
                      {/* タグがない場合でも対応できるようにする */}
                      {(post.tags || []).map(
                        (tag: string, tagIndex: number) => (
                          <span
                            key={tagIndex}
                            className="mr-2 inline-block rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                    <p>{strippedContent}</p>
                  </Link>
                </div>
              )
            }),
          )}
        </div>
      </section>
      <div className="mt-20">
        <Sidebar
          SidebarComponents={[<SideBarCategoryLists key="category" />]}
        />
      </div>
    </>
  )
}

export default BlogGrid
