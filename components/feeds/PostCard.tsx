"use client"

import * as React from "react"
import { Heart, MessageCircle, Eye, Bookmark, MoreVertical, X, Send, MessageSquare } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"

import { ASSET_URL } from "@/services/apiEndpoints"
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { toggleLike, deleteFeed, updateFeed, getAllComments, createComment, deleteComment } from "@/features/feeds/feedThunk"
import { IComment } from "@/features/feeds/feedModel"
import { formatDistanceToNow } from "date-fns"
import { Edit2, Trash2, ShieldAlert, Share2, Link2, Loader2, Image as ImageIcon } from "lucide-react"

export interface PostCardProps {
  id: string;
  author: {
    firstName: string;
    lastName: string;
    avatar: string;
    roleId?: { name: string };
    universityId?: { name: string };
  };
  content: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  publishedAt: string;
  media?: string;
}

export function PostCard({
  id,
  author,
  content,
  hashtags,
  likesCount,
  commentsCount,
  viewsCount,
  publishedAt,
  media
}: PostCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isAuthor = user?._id === author._id;

  const [isLiked, setIsLiked] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [shouldShowExpand, setShouldShowExpand] = React.useState(false)
  const contentRef = React.useRef<HTMLParagraphElement>(null)
  const [selectedImg, setSelectedImg] = React.useState<string | null>(null)

  // Edit States
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editContent, setEditContent] = React.useState(content)
  const [editMedia, setEditMedia] = React.useState<File | null>(null)
  const [editMediaPreview, setEditMediaPreview] = React.useState<string | null>(media ? `${ASSET_URL}${media}` : null)
  const [mediaRemoved, setMediaRemoved] = React.useState(false)
  const [editLoading, setEditLoading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Comment States
  const [showComments, setShowComments] = React.useState(false)
  const [commentsList, setCommentsList] = React.useState<IComment[]>([])
  const [commentText, setCommentText] = React.useState("")
  const [isLoadingComments, setIsLoadingComments] = React.useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)

  // Delete State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  // Comment Handlers
  const fetchComments = async () => {
    if (commentsList.length > 0) return; // Already loaded
    setIsLoadingComments(true);
    try {
      const res = await dispatch(getAllComments(id));
      if (getAllComments.fulfilled.match(res)) {
        setCommentsList(res.payload);
      }
    } catch (err) {
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmittingComment(true);
    try {
      const res = await dispatch(createComment({ id, commentData: { content: commentText } }));
      if (createComment.fulfilled.match(res)) {
        setCommentsList([res.payload, ...commentsList]);
        setCommentText("");
        toast.success("Comment added!");
      }
    } catch (err) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await dispatch(deleteComment(commentId));
      if (deleteComment.fulfilled.match(res)) {
        setCommentsList(commentsList.filter(c => c._id !== commentId));
        toast.success("Comment deleted");
      }
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  React.useEffect(() => {
    if (contentRef.current) {
      const isTruncated = contentRef.current.scrollHeight > contentRef.current.clientHeight
      setShouldShowExpand(isTruncated)
    }
  }, [content])

  return (
    <motion.div
      id={`post-${id}`}
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
                    src={author.avatar ? `${ASSET_URL}${author.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.firstName}`}
                    alt={`${author.firstName} ${author.lastName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-x-0 -bottom-1 flex justify-center">
                  <div className="w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h3 className="text-base font-bold leading-none mb-1 cursor-pointer hover:text-primary transition-colors uppercase tracking-tight">
                  {author.firstName} {author.lastName}
                </h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
                  {author.roleId?.name || "Member"} • <span className="text-primary/70">{author.universityId?.name || "StudentNexus"}</span>
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted/50 rounded-full h-8 w-8 outline-none">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-gray-100 shadow-xl overflow-hidden bg-white/90 backdrop-blur-xl border">
                {isAuthor && (
                  <>
                    <DropdownMenuItem
                      onClick={() => setIsEditDialogOpen(true)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/5 rounded-xl transition-all group"
                    >
                      <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Edit2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-[12px] font-bold text-[#1a1a3b]">Edit Post</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-rose-50 rounded-xl transition-all group mt-1"
                    >
                      <div className="p-1.5 bg-rose-100/50 rounded-lg group-hover:bg-rose-100 transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <span className="text-[12px] font-bold text-rose-500">Delete Post</span>
                    </DropdownMenuItem>
                    <div className="my-2 border-t border-gray-50 mx-1" />
                  </>
                )}

                <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-orange-50 rounded-xl transition-all group">
                  <div className="p-1.5 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1a1a3b]">{isAuthor ? "View Report Status" : "Report Post"}</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 rounded-xl transition-all group mt-1">
                  <div className="p-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1a1a3b]">Share Story</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/feeds?post=${id}`);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-all group mt-1"
                >
                  <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Link2 className="w-3.5 h-3.5 text-gray-500" />
                  </div>
                  <span className="text-[12px] font-bold text-[#1a1a3b]">Copy Link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className={cn("px-6 mb-4", !hashtags.length && !media && "mb-6")}>
            <p
              ref={contentRef}
              className="text-[#1a1a3b]/90 text-[15px] leading-relaxed tracking-tight font-medium"
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
                className="text-primary hover:text-primary/80 text-[11px] font-black uppercase tracking-wider mt-2 transition-all flex items-center gap-1"
              >
                {isExpanded ? "Collapse Content" : "Read Full Story"}
              </button>
            )}
          </div>

          {/* Media Section */}
          {media && (
            <div className="px-6 mb-5">
              <div
                onClick={() => setSelectedImg(`${ASSET_URL}${media}`)}
                className="w-fit max-w-full rounded-xl overflow-hidden border border-gray-100 max-h-[150px] bg-gray-50/50 flex items-center justify-center cursor-zoom-in group/container relative hover:shadow-inner transition-all duration-500"
              >
                <img
                  src={`${ASSET_URL}${media}`}
                  alt="Post media"
                  className="max-h-[150px] w-auto object-contain transition-transform duration-1000 group-hover/container:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/container:bg-black/5 transition-colors duration-500" />
              </div>
            </div>
          )}

          {/* Image Preview Lightbox */}
          <Dialog open={!!selectedImg} onOpenChange={(open) => !open && setSelectedImg(null)}>
            <DialogContent className="max-w-4xl border-none bg-transparent shadow-none p-0 overflow-hidden outline-none">
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

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="px-6 flex flex-wrap gap-2 mb-6">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all cursor-pointer uppercase tracking-widest"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions Row */}
          <div className="px-6 pb-6 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => {
                    setIsLiked(!isLiked);
                    dispatch(toggleLike(id));
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border",
                    isLiked
                      ? "bg-rose-50 text-rose-500 border-rose-100"
                      : "text-muted-foreground hover:text-rose-500 hover:bg-rose-50/50 border-transparent hover:border-rose-100"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current animate-bounce")} style={{ animationIterationCount: 1 }} />
                  <span className="text-[11px] font-black tracking-tight">{likesCount + (isLiked ? 1 : 0)}</span>
                </button>

                <button 
                  onClick={() => {
                    setShowComments(!showComments);
                    if (!showComments) fetchComments();
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border",
                    showComments 
                      ? "bg-blue-50 text-blue-500 border-blue-100" 
                      : "text-muted-foreground hover:text-blue-500 hover:bg-blue-50/50 hover:border-blue-100"
                  )}
                >
                  <MessageCircle className={cn("w-4 h-4", showComments && "fill-current")} />
                  <span className="text-[11px] font-black tracking-tight">{commentsList.length > 0 ? commentsList.length : commentsCount}</span>
                </button>

                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 border",
                    isSaved
                      ? "bg-amber-50 text-amber-500 border-amber-100 shadow-sm"
                      : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50/50 border-transparent hover:border-amber-100"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-muted-foreground/40 bg-gray-50/50 px-2 py-1 rounded-lg">
                  <Eye className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{viewsCount}</span>
                </div>

                <div className="hidden sm:block">
                  <span className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest bg-gray-50/50 px-2.5 py-1 rounded-lg border border-gray-100/50">
                    {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Published At */}
            <div className="sm:hidden flex justify-end">
              <span className="text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
                {formatDistanceToNow(new Date(publishedAt), { addSuffix: true })}
              </span>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 pt-6 border-t border-gray-50 overflow-hidden"
                >
                  {/* Comment Input */}
                  <div className="flex gap-3 mb-8">
                    <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 ring-2 ring-primary/10">
                      <img 
                        src={user?.avatar ? `${ASSET_URL}${user.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || "Student"}`} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <Input 
                        placeholder="Join the discussion..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                        className="h-10 pr-12 bg-gray-50/50 border-gray-100/50 rounded-xl focus:bg-white transition-all text-xs font-medium placeholder:text-gray-400"
                      />
                      <button 
                        disabled={isSubmittingComment || !commentText.trim()}
                        onClick={handleAddComment}
                        className="absolute right-2 top-1.5 p-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all disabled:opacity-30 disabled:grayscale"
                      >
                        {isSubmittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {isLoadingComments ? (
                      <div className="py-10 flex flex-col items-center justify-center gap-3 text-muted-foreground/40">
                        <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Fetching reflections...</p>
                      </div>
                    ) : commentsList.length > 0 ? (
                      commentsList.map((comment) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={comment._id} 
                          className="flex gap-3 group"
                        >
                          <div className="h-8 w-8 rounded-full overflow-hidden shrink-0 mt-0.5">
                            <img 
                              src={comment.authorId.avatar ? `${ASSET_URL}${comment.authorId.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorId.firstName}`} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50/80 p-3 rounded-2xl rounded-tl-none relative border border-gray-100/50">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-bold text-[#1a1a3b]">{comment.authorId.firstName} {comment.authorId.lastName}</span>
                                <span className="text-[9px] text-muted-foreground/60 font-medium">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-[12px] text-[#1a1a3b]/80 leading-relaxed font-medium">{comment.content}</p>

                              {/* Delete Comment - Restricted visibility */}
                              {(comment.authorId._id === user?._id || isAuthor) && (
                                <button 
                                  onClick={() => handleDeleteComment(comment._id)}
                                  className="absolute -right-2 -top-2 p-1.5 bg-white text-rose-500 rounded-lg shadow-sm border border-rose-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center gap-3 text-muted-foreground/30">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                          <MessageSquare className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">No reflections yet. Start the story.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-2xl">
                      <Edit2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-black text-[#1a1a3b] tracking-tight">Edit Your Story</DialogTitle>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Refine your thoughts and media</p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a3b] opacity-60 ml-1">Content</Label>
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="What's changing in your world?"
                      className="min-h-[150px] rounded-2xl border-gray-100 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-gray-50/50 p-4 font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1a1a3b] opacity-60">Media Attachment</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg"
                      >
                        <ImageIcon className="w-3 h-3 mr-1.5" />
                        {editMediaPreview ? "Change Media" : "Add Media"}
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditMedia(file);
                            setEditMediaPreview(URL.createObjectURL(file));
                            setMediaRemoved(false);
                          }
                        }}
                      />
                    </div>
                    
                    {editMediaPreview ? (
                      <div className="w-full h-40 rounded-2xl overflow-hidden border border-gray-100 group relative bg-gray-50/50 flex items-center justify-center">
                        <img src={editMediaPreview} className="max-w-full max-h-full object-contain" />
                        <button 
                          onClick={() => {
                            setEditMedia(null);
                            setEditMediaPreview(null);
                            setMediaRemoved(true);
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 text-rose-500 rounded-xl shadow-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50/50 transition-all group"
                      >
                        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                          <ImageIcon className="w-6 h-6 text-gray-300 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Share a visual moment</p>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter className="mt-8 flex gap-3 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={editLoading || (editContent === content && !editMedia && !mediaRemoved)}
                    onClick={async () => {
                      setEditLoading(true);
                      const formData = new FormData();
                      formData.append("content", editContent);
                      if (editMedia) {
                        formData.append("media", editMedia);
                      } else if (mediaRemoved) {
                        formData.append("media", ""); // Signal removal
                      }
                      
                      const res = await dispatch(updateFeed({ id, feedData: formData as any }));
                      if (updateFeed.fulfilled.match(res)) {
                        toast.success("Post updated successfully!");
                        setIsEditDialogOpen(false);
                      } else {
                        toast.error("Failed to update post");
                      }
                      setEditLoading(false);
                    }}
                    className="flex-1 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-xl">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-8 h-8 text-rose-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-[#1a1a3b] tracking-tight mb-2 uppercase">Delete Story?</h3>
                <p className="text-sm text-muted-foreground font-medium px-4">This action cannot be undone. Your story and its memories will be permanently removed.</p>

                <div className="mt-8 flex flex-col gap-2">
                  <Button
                    disabled={deleteLoading}
                    onClick={async () => {
                      setDeleteLoading(true);
                      const res = await dispatch(deleteFeed(id));
                      if (deleteFeed.fulfilled.match(res)) {
                        toast.success("Story removed from your timeline");
                        setIsDeleteDialogOpen(false);
                      } else {
                        toast.error("Failed to delete story");
                      }
                      setDeleteLoading(false);
                    }}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all"
                  >
                    {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete Permanently"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setIsDeleteDialogOpen(false)}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-gray-50"
                  >
                    I changed my mind
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  )
}
