import React, { useState, useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { useInView } from 'react-intersection-observer';
import {
  Search,
  Download,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
} from 'lucide-react';
import { useGetScreenshotsQuery, useDeleteScreenshotMutation, useFlagScreenshotMutation } from '../services/screenshotsApi';
import type { Screenshot } from '@/shared/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

interface ScreenshotsTabProps {
  studentId: string;
  selectedDate: Date;
}

type SortBy = 'newest' | 'oldest' | 'recentActivity';

export const ScreenshotsTab: React.FC<ScreenshotsTabProps> = ({
  studentId,
  selectedDate,
}) => {
  const [startDate, setStartDate] = useState<string>(
    format(selectedDate, 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = useState<string>(
    format(selectedDate, 'yyyy-MM-dd')
  );
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [productiveOnly, setProductiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [selectedScreenshots, setSelectedScreenshots] = useState<Set<string>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const {
    data: screenshotsData,
    isLoading,
  } = useGetScreenshotsQuery({
    page,
    limit,
    startDate,
    endDate,
    flaggedOnly,
    productiveOnly,
    search: searchTerm || undefined,
    sortBy,
    userId: studentId,
  });

  const [deleteScreenshot] = useDeleteScreenshotMutation();
  const [flagScreenshot] = useFlagScreenshotMutation();

  const screenshots = screenshotsData?.data?.screenshots || [];
  const pagination = screenshotsData?.data?.pagination;

  // Lazy loading trigger
  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView && pagination?.hasNext && !isLoading) {
      setPage((p) => p + 1);
    }
  }, [inView, pagination?.hasNext, isLoading]);

  // Sort screenshots
  const sortedScreenshots = useMemo(() => {
    const sorted = [...screenshots];
    switch (sortBy) {
      case 'newest':
        return sorted.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      case 'oldest':
        return sorted.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      case 'recentActivity':
        return sorted.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      default:
        return sorted;
    }
  }, [screenshots, sortBy]);

  const toggleSelection = (id: string) => {
    setSelectedScreenshots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedScreenshots.size === sortedScreenshots.length) {
      setSelectedScreenshots(new Set());
    } else {
      setSelectedScreenshots(new Set(sortedScreenshots.map((s) => s.id)));
    }
  };

  const handleDownload = async (screenshot: Screenshot) => {
    try {
      const response = await fetch(screenshot.url);
      const blob = await response.blob();
      const filename = `screenshot-${format(new Date(screenshot.timestamp), 'yyyy-MM-dd-HH-mm-ss')}.png`;
      saveAs(blob, filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleBulkDownload = async () => {
    try {
      const zip = new JSZip();
      const selected = sortedScreenshots.filter((s) => selectedScreenshots.has(s.id));

      for (const screenshot of selected) {
        try {
          const response = await fetch(screenshot.url);
          const blob = await response.blob();
          const filename = `screenshot-${format(new Date(screenshot.timestamp), 'yyyy-MM-dd-HH-mm-ss')}.png`;
          zip.file(filename, blob);
        } catch (error) {
          console.error(`Failed to download ${screenshot.id}:`, error);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `screenshots-${format(new Date(), 'yyyy-MM-dd')}.zip`);
      setSelectedScreenshots(new Set());
    } catch (error) {
      console.error('Bulk download failed:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedScreenshots.size} screenshots?`)) return;

    for (const id of selectedScreenshots) {
      try {
        await deleteScreenshot(id).unwrap();
      } catch (error) {
        console.error(`Failed to delete ${id}:`, error);
      }
    }
    setSelectedScreenshots(new Set());
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex((prev) => (prev > 0 ? prev - 1 : sortedScreenshots.length - 1));
    } else {
      setLightboxIndex((prev) => (prev < sortedScreenshots.length - 1 ? prev + 1 : 0));
    }
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'ArrowRight') navigateLightbox('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const currentScreenshot = sortedScreenshots[lightboxIndex];

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Date Range
              </label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={flaggedOnly}
                  onChange={(e) => setFlaggedOnly(e.target.checked)}
                />
                <span className="text-sm">Show Flagged Only</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={productiveOnly}
                  onChange={(e) => setProductiveOnly(e.target.checked)}
                />
                <span className="text-sm">Productive Apps Only</span>
              </label>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Window title or app..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="recentActivity">Most Recent Activity</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setStartDate(format(selectedDate, 'yyyy-MM-dd'));
                setEndDate(format(selectedDate, 'yyyy-MM-dd'));
                setFlaggedOnly(false);
                setProductiveOnly(false);
                setSearchTerm('');
                setSortBy('newest');
              }}
            >
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Gallery Area */}
      <div className="flex-1">
        {/* Bulk Actions Toolbar */}
        {selectedScreenshots.size > 0 && (
          <Card className="mb-4">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">
                    {selectedScreenshots.size} screenshots selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectAll}
                  >
                    {selectedScreenshots.size === sortedScreenshots.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDownload}
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download as ZIP</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Selected</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : sortedScreenshots.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No screenshots found for selected filters</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedScreenshots.map((screenshot, index) => (
              <ScreenshotThumbnail
                key={screenshot.id}
                screenshot={screenshot}
                isSelected={selectedScreenshots.has(screenshot.id)}
                onSelect={() => toggleSelection(screenshot.id)}
                onClick={() => openLightbox(index)}
                onDownload={() => handleDownload(screenshot)}
              />
            ))}
            {pagination?.hasNext && (
              <div ref={ref} className="col-span-full">
                {isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentScreenshot && (
        <LightboxModal
          screenshot={currentScreenshot}
          onClose={closeLightbox}
          onPrev={() => navigateLightbox('prev')}
          onNext={() => navigateLightbox('next')}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < sortedScreenshots.length - 1}
          onDownload={() => handleDownload(currentScreenshot)}
          onDelete={() => {
            deleteScreenshot(currentScreenshot.id);
            if (lightboxIndex >= sortedScreenshots.length - 1) {
              closeLightbox();
            } else {
              navigateLightbox('next');
            }
          }}
          onFlag={() => {
            flagScreenshot({
              id: currentScreenshot.id,
              flagged: !currentScreenshot.isFlagged,
            });
          }}
        />
      )}
    </div>
  );
};

// Screenshot Thumbnail Component
interface ScreenshotThumbnailProps {
  screenshot: Screenshot;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  onDownload: () => void;
}

const ScreenshotThumbnail: React.FC<ScreenshotThumbnailProps> = ({
  screenshot,
  isSelected,
  onSelect,
  onClick,
  onDownload,
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        screenshot.isFlagged
          ? 'border-red-500'
          : isSelected
          ? 'border-blue-500'
          : 'border-gray-200'
      }`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.checkbox-container')) {
          e.stopPropagation();
          return;
        }
        onClick();
      }}
    >
      {/* Checkbox */}
      <div className="checkbox-container absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* App Badge */}
      <Badge
        variant="secondary"
        className="absolute top-2 right-2 z-10 text-xs"
      >
        {screenshot.appName}
      </Badge>

      {/* Image */}
      {!imageError ? (
        <>
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 w-full h-full" />
          )}
          <img
            src={screenshot.thumbnailUrl || screenshot.url}
            alt={screenshot.windowTitle}
            className={`w-full h-64 object-cover transition-opacity ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        </>
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Failed to load</p>
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
        <p className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
          Click to view
        </p>
      </div>

      {/* Timestamp */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
        <p className="text-white text-xs">
          {formatDistanceToNow(new Date(screenshot.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

// Lightbox Modal Component
interface LightboxModalProps {
  screenshot: Screenshot;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onDownload: () => void;
  onDelete: () => void;
  onFlag: () => void;
}

const LightboxModal: React.FC<LightboxModalProps> = ({
  screenshot,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onDownload,
  onDelete,
  onFlag,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-7xl w-full h-full flex">
        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <img
            src={screenshot.url}
            alt={screenshot.windowTitle}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Navigation Arrows */}
        {hasPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Info Panel */}
        <div
          className="w-80 bg-gray-900 text-white p-6 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4">Screenshot Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">Timestamp</p>
              <p className="text-sm">{format(new Date(screenshot.timestamp), 'PPpp')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">App Name</p>
              <p className="text-sm">{screenshot.appName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Window Title</p>
              <p className="text-sm">{screenshot.windowTitle}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">File Size</p>
              <p className="text-sm">{formatFileSize(screenshot.fileSize)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Resolution</p>
              <p className="text-sm">
                {screenshot.width} × {screenshot.height}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Flagged Status</p>
              <Badge
                variant={screenshot.isFlagged ? 'destructive' : 'secondary'}
                className="mt-1"
              >
                {screenshot.isFlagged ? 'Flagged' : 'Not Flagged'}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onFlag}
            >
              <Flag className="h-4 w-4 mr-2" />
              {screenshot.isFlagged ? 'Unflag' : 'Flag'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-red-400"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
