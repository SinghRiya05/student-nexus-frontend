import React from 'react'
import { CreatePost } from '@/components/feeds/CreatePost'
import { FeedList } from '@/components/feeds/FeedList'
import { TrendingSidebar } from '@/components/feeds/TrendingSidebar'

export default function FeedsPage() {
    return (
        <div className="min-h-screen bg-transparent animate-fade-in-up ">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content (Create Post + Feeds) */}
                <div className="flex flex-col lg:col-span-8">
                    <section>
                        <CreatePost />
                    </section>

                    <section>
                        <FeedList />
                    </section>
                </div>

                {/* Right Sidebar: Trending Stories */}
                <aside className="hidden lg:block lg:col-span-4 h-fit sticky top-20">
                    <TrendingSidebar />
                </aside>
            </div>
        </div>
    )
}