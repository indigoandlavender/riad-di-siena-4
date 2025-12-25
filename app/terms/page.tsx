import { getLegalPageBySlug } from '@/lib/nexus'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TermsPage() {
  const page = await getLegalPageBySlug('terms')

  return (
    <div className="min-h-screen bg-cream">
      <section className="border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {page?.title || 'Terms of Use'}
          </h1>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="prose prose-gray max-w-none">
          {page?.content ? (
            <div 
              className="text-foreground/70 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-foreground/60">
              Terms of use content will be loaded from Nexus.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
