import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Section from '@/components/ui/Section';
import { Button } from '@/components/ui/shadcn/button';

export default function CTASection() {
  return (
    <Section className="py-24 max-w-7xl mx-auto px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
          Ready to find your community?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse all organizations, discover student communities, and connect
          with fellow students who share your interests.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Button size="lg" asChild className="h-12 px-8 font-bold shadow-lg">
            <Link to="/org">
              Browse All Organizations{' '}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
