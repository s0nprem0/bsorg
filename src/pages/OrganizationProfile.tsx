import { useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { getOrgBySlug, organizations } from '@/lib/orgIndex';
import { getSocialEntries } from '@/lib/utils';
import { getCampusName } from '@/data/campuses';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProfileHeader from '@/components/sections/ProfileHeader';
import ProfileTabs from '@/components/sections/ProfileTabs';
import { parseTab } from '@/components/sections/profileTab';
import ProfileInfoRail from '@/components/sections/ProfileInfoRail';
import ProfileOrgList from '@/components/sections/ProfileOrgList';
import { NotFoundState } from '@/components/sections/ProfileStates';

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const org = getOrgBySlug(slug);
  const campusName = getCampusName(org?.campusId);

  // Exact slug match. Array.includes() does substring matching, so a future
  // slug that happens to sit inside another (e.g. "cas" in "cas-sc") would
  // silently list unrelated orgs as sub-organizations.
  const subOrgs = useMemo(
    () =>
      slug
        ? organizations.filter(o => o.parentSlug?.some(p => p === slug))
        : [],
    [slug]
  );

  const parentOrgs = useMemo(() => {
    const slugs = org?.parentSlug;
    if (!slugs?.length) return [];
    const wanted = new Set(slugs.map(p => p.toLowerCase()));
    return organizations.filter(o => wanted.has(o.slug.toLowerCase()));
  }, [org]);

  /**
   * Related orgs, scored on category / type / shared tags. Sub-organizations and
   * the parent are excluded: they already appear on this page, and since they
   * share a category they always scored highest, so the section used to
   * re-list four orgs the visitor had just scrolled past.
   */
  const relatedOrgs = useMemo(() => {
    if (!org) return [];
    const exclude = new Set([org.slug, ...subOrgs.map(o => o.slug)]);

    return organizations
      .filter(o => !exclude.has(o.slug))
      .map(o => {
        let score = 0;
        if (o.category === org.category) score += 5;
        if (o.type === org.type) score += 3;
        const own = org.metadata?.tags ?? [];
        score += own.filter(t => (o.metadata?.tags ?? []).includes(t)).length * 2;
        return { org: o, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(r => r.org);
  }, [org, subOrgs]);

  if (!org) return <NotFoundState />;

  const tab = parseTab(searchParams.get('tab'));
  const socialEntries = getSocialEntries(org.contact);
  const about = org.content?.about ?? org.content?.shortDescription;

  return (
    <>
      <SEO
        title={org.name}
        description={org.content?.shortDescription}
        image={org.assets?.bannerUrl || org.assets?.logoUrl}
      />

      <div className="min-h-screen bg-background pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="animate-fade-in-up flex items-center gap-2 py-4">
            <button
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate('/org');
              }}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-panel text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ArrowLeft size={16} />
              <span className="sr-only">Back</span>
            </button>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Organizations', href: '/org' },
                { label: org.acronym || org.name },
              ]}
            />
          </nav>

          <ProfileHeader
            org={org}
            socialEntries={socialEntries}
            subOrgCount={subOrgs.length}
            campusName={campusName}
          />

          <div className="mt-5">
            <ProfileTabs
              counts={{ suborgs: subOrgs.length, similar: relatedOrgs.length }}
            />
          </div>

          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            tabIndex={-1}
            className="animate-fade-in-up pt-5 focus-visible:outline-none"
          >
            {tab === 'overview' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="min-w-0 space-y-7">
                  <section>
                    <h2 className="px-2 pb-2 text-sm font-semibold text-foreground">
                      About
                    </h2>
                    {about ? (
                      <p className="rounded-panel bg-surface-2/60 p-4 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                        {about}
                      </p>
                    ) : (
                      <p className="rounded-panel border border-border/50 border-dashed p-4 text-sm text-muted-foreground">
                        This organization has not added a description yet.
                      </p>
                    )}
                  </section>

                  {/* The channel list is the memorable part, so it lives on the
                      landing tab rather than behind a click. */}
                  <ProfileOrgList
                    orgs={subOrgs}
                    title="Sub-Organizations"
                    emptyMessage="No sub-organizations are listed under this organization."
                  />

                  <ProfileOrgList
                    orgs={relatedOrgs}
                    title="Similar Organizations"
                  />
                </div>

                <ProfileInfoRail
                  org={org}
                  campusName={campusName}
                  parentOrgs={parentOrgs}
                  socialEntries={socialEntries}
                />
              </div>
            )}

            {tab === 'suborgs' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
                <ProfileOrgList
                  orgs={subOrgs}
                  title="Sub-Organizations"
                  emptyMessage="No sub-organizations are listed under this organization."
                />
                <ProfileInfoRail
                  org={org}
                  campusName={campusName}
                  parentOrgs={parentOrgs}
                  socialEntries={socialEntries}
                />
              </div>
            )}

            {tab === 'similar' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
                <ProfileOrgList
                  orgs={relatedOrgs}
                  title="Similar Organizations"
                  emptyMessage="No closely related organizations were found."
                />
                <ProfileInfoRail
                  org={org}
                  campusName={campusName}
                  parentOrgs={parentOrgs}
                  socialEntries={socialEntries}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}