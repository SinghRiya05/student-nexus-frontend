"use client"

import * as React from "react"
import { Heart, MessageCircle, Eye, Bookmark, MoreVertical, X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface PostCardProps {
  user: {
    name: string;
    role: string;
    organization: string;
    avatar: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  publishedAt: string;
  images?: string[];
}

export function PostCard({ user, content, tags, likes, comments, views, publishedAt, images }: PostCardProps) {
  const [isLiked, setIsLiked] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [shouldShowExpand, setShouldShowExpand] = React.useState(false)
  const contentRef = React.useRef<HTMLParagraphElement>(null)
  const [selectedImg, setSelectedImg] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (contentRef.current) {
      const isTruncated = contentRef.current.scrollHeight > contentRef.current.clientHeight
      setShouldShowExpand(isTruncated)
    }
  }, [content])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-500  overflow-hidden">
        <CardContent className="">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 transition-all duration-300 group-hover:border-primary/50">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 -bottom-1 flex justify-center">
                  <div className="w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold leading-none mb-1 cursor-pointer hover:text-primary transition-colors">
                  {user.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {user.role} • <span className="text-primary/70">{user.organization}</span>
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className={cn("mb-5", !tags.length && !images?.length && "mb-0")}>
            <p
              ref={contentRef}
              className="text-foreground/90 text-sm md:text-base leading-relaxed tracking-tight"
              style={
                !isExpanded
                  ? {
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                  }
                  : {
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word"
                  }
              }
            >
              {content}
            </p>

            {(shouldShowExpand || isExpanded) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:underline text-sm font-bold mt-1 transition-all"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>

          {/* Images Grid */}
          {images && images.length > 0 && (
            <div className={cn(
              "mb-6 rounded-2xl overflow-hidden grid gap-2 border border-border/40 max-h-42",
              images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {images.slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={cn(
                    "relative overflow-hidden group/img cursor-zoom-in bg-muted/20",
                    images.length === 1 ? "h-64" : "h-36 md:h-44",
                    images.length === 3 && idx === 0 && "row-span-2 h-full"
                  )}
                >
                  <img
                    src={img}
                    alt={`Post ${idx}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          )}

          {/* Image Preview Lightbox */}
          <Dialog open={!!selectedImg} onOpenChange={(open) => !open && setSelectedImg(null)}>
            <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 overflow-hidden">
              <DialogHeader className="sr-only">
                <DialogTitle>Image Preview</DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={selectedImg || ""}
                  alt="Preview"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                />
                <button
                  onClick={() => setSelectedImg(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions Row */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <div className="flex items-center gap-1 sm:gap-6">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={cn(
                    "flex items-center gap-2 group transition-all duration-300",
                    isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full transition-colors group-hover:bg-red-50",
                    isLiked && "bg-red-50"
                  )}>
                    <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                  </div>
                  <span className="text-xs font-bold">{likes + (isLiked ? 1 : 0)}</span>
                </button>

                <button className="flex items-center gap-2 group transition-all duration-300 text-muted-foreground hover:text-blue-500">
                  <div className="p-2 rounded-full transition-colors group-hover:bg-blue-50">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold">{comments}</span>
                </button>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={cn(
                    "flex items-center gap-2 group transition-all duration-300",
                    isSaved ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-full transition-colors group-hover:bg-amber-50",
                    isSaved && "bg-amber-50"
                  )}>
                    <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
                  </div>
                </button>

                <div className="flex items-center gap-2 text-muted-foreground ml-auto sm:ml-0">
                  <Eye className="w-4 h-4" />
                  <span className="text-xs font-bold">{views}</span>
                </div>
              </div>

              <div className="hidden sm:block">
                <span className="text-xs text-muted-foreground/60 font-medium">
                  Published at {publishedAt}
                </span>
              </div>
            </div>

            {/* Mobile Published At */}
            <div className="sm:hidden flex justify-end">
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                Published at {publishedAt}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
