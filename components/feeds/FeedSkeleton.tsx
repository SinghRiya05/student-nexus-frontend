"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"

export function FeedSkeleton() {
  return (
    <div className="mb-6 w-full">
      <Card className="rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <CardContent className="p-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-3 w-48 bg-gray-100 rounded-md animate-pulse" />
              </div>
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-3 mb-6">
            <div className="h-4 w-full bg-gray-100 rounded-md animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-100 rounded-md animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-100 rounded-md animate-pulse" />
          </div>

          {/* Media Skeleton (Mock the large image block) */}
          <div className="w-full h-48 bg-gray-50 rounded-2xl border border-gray-100 animate-pulse mb-6" />

          {/* Actions Skeleton */}
          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-9 w-16 bg-gray-50 rounded-xl animate-pulse" />
              <div className="h-9 w-16 bg-gray-50 rounded-xl animate-pulse" />
              <div className="h-9 w-12 bg-gray-50 rounded-xl animate-pulse" />
            </div>
            <div className="h-6 w-24 bg-gray-50 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
