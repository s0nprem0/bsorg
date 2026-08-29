import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import SEO from '@/components/SEO';
import { useOrg, useOrgs } from '@/hooks/useOrgService';
import { getSocialEntries } from '@/lib/utils';
import { CAMPUSES } from '@/data/campuses';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import OrgGrid from '@/components/layout/OrgGrid';
import RelatedOrganizations from '@/components/sections/RelatedOrganizations';
import ProfileIdentityCard from '@/components/sections/ProfileIdentityCard';
import ProfileCampusCard from '@/components/sections/ProfileCampusCard';
import ProfileConnectCard from '@/components/sections/ProfileConnectCard';
import ProfileAboutCard from '@/components/sections/ProfileAboutCard';
import { LoadingSkeleton, ErrorState, NotFoundState } from '@/components/sections/ProfileStates';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';

export default function OrganizationProfile() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { org, loading, error } = useOrg(slug);
  const { orgs: allOrgs } = useOrgs();
  const campus = CAMPUSES.find(c => c.id === org?.campusId);

  const subOrgs = useMemo(
    () => (slug ? allOrgs.filter(o => o.parentSlug?.includes(slug)) : []),
    [allOrgs, slug]
  );
  const parentOrgs = useMemo(
    () => {
      const slugs = org?.parentSlug;
      return slugs?.length
        ? allOrgs.filter(o => slugs.some(p => o.slug.toLowerCase() === p.toLowerCase()))
        : [];
    },
    [allOrgs, org]
  );

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!org) return <NotFoundState />;

  const socialEntries = getSocialEntries(org.contact);

  return (
    <>
      <SEO
        title={org.name}
        description={org.content?.shortDescription}
        image={org.assets?.bannerUrl || org.assets?.logoUrl}
      />

      <div className="min-h-screen bg-background pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">

          <div className="animate-fade-in-up flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { if (window.history.length > 1) navigate(-1); else navigate('/org'); }} className="gap-1.5 shrink-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Organizations', href: '/org' },
                { label: org.acronym || org.name },
              ]}
            />
          </div>

          {org.assets?.bannerUrl && (
            <div className="animate-fade-in-up animate-delay-100 rounded-xl overflow-hidden">
              <div className="relative aspect-[820/312]">
                <img
                  src={org.assets.bannerUrl}
                  alt={`${org.name} banner`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            <ProfileIdentityCard org={org} />

            <div className="md:col-span-1 lg:col-span-2 flex flex-col gap-5 lg:gap-6">
              <ProfileCampusCard org={org} campusName={campus?.name || 'N/A'} parentOrgs={parentOrgs} />
              <ProfileConnectCard org={org} socialEntries={socialEntries} />
            </div>

            <ProfileAboutCard org={org} />
          </div>

          {subOrgs.length > 0 && (
            <section className="animate-fade-in-up animate-delay-400">
              <Card className="bg-surface-1 border-none shadow-md overflow-hidden">
                <CardHeader className="border-b border-border/50 pb-6 bg-surface-2/30">
                  <CardTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                    <Users className="text-primary h-5 w-5" />
                    Sub-Organizations
                    <span className="text-xs font-normal text-muted-foreground ml-auto">
                      {subOrgs.length} {subOrgs.length === 1 ? 'org' : 'orgs'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <OrgGrid organizations={subOrgs} columns={4} />
                </CardContent>
              </Card>
            </section>
          )}

          <div className="animate-fade-in-up animate-delay-500">
            <RelatedOrganizations currentOrg={org} />
          </div>
        </section>
      </div>
    </>
  );
}
