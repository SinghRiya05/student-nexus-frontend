"use client"

import * as React from "react"
import { Image as ImageIcon, Link2, Hash, Send, X, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAppDispatch, useAppSelector } from "@/utils/hook"
import { createFeed } from "@/features/feeds/feedThunk"
import { ASSET_URL } from "@/services/apiEndpoints"
import { toast } from "react-hot-toast"

const CreatePostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty"),
  media: z.any().optional(),
  hashtags: z.array(z.string()).optional(),
})

type PostFormValues = {
  content: string;
  media: File | null;
  mediaPreview: string | null;
  hashtags: string[];
}

export function CreatePost() {
  const [isFocused, setIsFocused] = React.useState(false)
  const [showLinkInput, setShowLinkInput] = React.useState(false)
  const [showHashtagInput, setShowHashtagInput] = React.useState(false)
  const [hashtagInput, setHashtagInput] = React.useState("")

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<PostFormValues>({
    defaultValues: {
      content: "",
      media: null,
      mediaPreview: null,
      hashtags: [],
    },
  })

  const formValues = watch()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const onSubmit = async (data: PostFormValues) => {
    try {
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.media) {
        formData.append("media", data.media);
      }
      if (data.hashtags.length > 0) {
        // Backend expects array or stringified array
        formData.append("hashtags", JSON.stringify(data.hashtags));
      }

      const result = await dispatch(createFeed(formData as any)).unwrap();
      if (result) {
        toast.success("Post published successfully!");
        reset();
        setShowLinkInput(false);
        setShowHashtagInput(false);
        setIsFocused(false);
      }
    } catch (error: any) {
      toast.error(error || "Failed to publish post");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("media", file);
      setValue("mediaPreview", URL.createObjectURL(file));
    }
  }

  const removeMedia = () => {
    setValue("media", null);
    setValue("mediaPreview", null);
  }

  const addHashtag = () => {
    if (hashtagInput.trim() && !formValues.hashtags.includes(hashtagInput.trim())) {
      const tag = hashtagInput.trim().replace(/^#/, "")
      setValue("hashtags", [...formValues.hashtags, tag])
      setHashtagInput("")
    }
  }

  const removeHashtag = (index: number) => {
    setValue("hashtags", formValues.hashtags.filter((_, i) => i !== index))
  }

  const isFormEmpty = !formValues.content.trim() && !formValues.media

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 sticky top-15 z-20"
    >
      <Card className={cn(
        "rounded-2xl   transition-all outline-0 duration-300 bg-white ",
        isFocused || showLinkInput || showHashtagInput ? "shadow-xl" : "shadow-sm"
      )}>
        <CardContent className="p-5 border-0">
          <div className="flex gap-4">
            {/* User Avatar - Left Side */}
            <div className="shrink-0 pt-1">
              <div className="h-10 w-10 rounded-full bg-linear-to-tr from-primary to-[#7387ff] p-0.5 shadow-md group cursor-pointer overflow-hidden">
                <div className="h-full w-full rounded-full bg-white p-0.5 overflow-hidden">
                  <img
                    src={user?.avatar ? `${ASSET_URL}${user.avatar}` : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || "Student"}`}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <TextareaAutosize
                minRows={1}
                placeholder="What's on your mind? Share an update..."
                {...register("content")}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  if (isFormEmpty) setIsFocused(false)
                }}
                className="w-full bg-transparent text-lg resize-none focus:ring-0 placeholder:text-muted-foreground/40 leading-relaxed py-1 outline-none transition-all duration-300"
              />

              <AnimatePresence>
                {/* Image Preview Section */}
                {formValues.mediaPreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-2"
                  >
                    <div className="relative h-48 w-full rounded-2xl border border-border/50 overflow-hidden shrink-0 group shadow-sm bg-muted/20">
                      <img src={formValues.mediaPreview} alt="Upload" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                      <button
                        type="button"
                        onClick={removeMedia}
                        className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Link Input Section */}
                {showLinkInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 bg-muted/30 rounded-xl px-3 py-2 border border-primary/10 shadow-sm"
                  >
                    <Link2 className="w-4 h-4 text-primary shrink-0" />
                    <input
                      autoFocus
                      placeholder="Paste your link here..."
                      className="bg-transparent border-none text-sm w-full outline-none placeholder:text-muted-foreground/40 font-medium"
                      {...register("link")}
                    />
                    <button type="button" onClick={() => { setValue("link", ""); setShowLinkInput(false); }} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Hashtag Input Section */}
                {showHashtagInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-2 bg-muted/30 rounded-xl px-3 py-2 border border-primary/10 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-primary shrink-0" />
                      <input
                        autoFocus
                        placeholder="Add a hashtag..."
                        className="bg-transparent border-none text-sm w-full outline-none placeholder:text-muted-foreground/40 font-medium"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addHashtag()}
                      />
                      <button type="button" onClick={addHashtag} className="text-primary hover:scale-110 transition-transform">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => setShowHashtagInput(false)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {formValues.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {formValues.hashtags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 flex items-center gap-1 group">
                            #{tag}
                            <X
                              className="w-2.5 h-2.5 cursor-pointer hover:text-red-500 transition-colors"
                              onClick={() => removeHashtag(i)}
                            />
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-2">
                <div className="flex items-center gap-1 md:gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex items-center gap-2 group rounded-full transition-all px-3 h-8",
                      formValues.media ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <ImageIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider">Upload</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className={cn(
                      "flex items-center gap-2 group rounded-full transition-all px-3 h-8 text-muted-foreground/30 grayscale cursor-not-allowed"
                    )}
                  >
                    <Link2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider">Link</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setShowHashtagInput(!showHashtagInput); setShowLinkInput(false); }}
                    className={cn(
                      "flex items-center gap-2 group rounded-full transition-all px-3 h-8",
                      formValues.hashtags.length > 0 || showHashtagInput ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Hash className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-wider">Hashtags</span>
                  </Button>
                </div>

                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isFormEmpty || isSubmitting}
                  className={cn(
                    "rounded-full px-6 font-bold transition-all duration-300 shadow-lg text-[11px] uppercase tracking-widest h-9",
                    !isFormEmpty
                      ? "bg-primary text-white shadow-primary/25 hover:shadow-primary/40"
                      : "bg-muted text-muted-foreground grayscale opacity-50"
                  )}
                  size="sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Posting
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5" />
                      Post
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
