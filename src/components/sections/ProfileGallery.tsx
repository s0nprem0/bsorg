import { ImageIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/shadcn/card';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import type { Organization } from '@/lib/orgIndex';

export default function ProfileGallery({ org }: { org: Organization }) {
  const images = org.assets?.galleryUrls;
  if (!images?.length) return null;

  return (
    <Card className="animate-fade-in-up animate-delay-300 md:col-span-3 lg:col-span-4 bg-card border-none shadow-md">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <ImageIcon className="text-primary shrink-0" size={18} /> Gallery
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            {images.length} {images.length === 1 ? 'photo' : 'photos'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((url, i) => (
            <Dialog key={url}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="group relative flex items-center justify-center overflow-hidden rounded-lg aspect-square bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`View gallery image ${i + 1}`}
                >
                  <ImageIcon size={24} className="text-muted-foreground/40" />
                  <img
                    src={url}
                    alt={`${org.name} gallery ${i + 1}`}
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    loading="lazy"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="rounded-full bg-background/60 backdrop-blur-sm p-2.5">
                      <ImageIcon size={18} className="text-foreground" />
                    </div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[90vw] bg-black/95 border-none p-4">
                <DialogTitle className="sr-only">{`${org.name} gallery image ${i + 1}`}</DialogTitle>
                <img
                  src={url}
                  alt={`${org.name} gallery ${i + 1}`}
                  className="w-full max-h-[85vh] object-contain rounded-lg"
                  onError={e => { e.currentTarget.style.display = 'none'; }}
                />
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
