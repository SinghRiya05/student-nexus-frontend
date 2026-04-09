import React from 'react'
import { CreatePost } from '@/components/feeds/CreatePost'
import { FeedList } from '@/components/feeds/FeedList'

export default function FeedsPage() {
    return (
        <div className="min-h-screen bg-transparent py-4 px-4  lg:px-0">
            <div className="max-w-3xl mx-auto flex flex-col gap-8 animate-fade-in-up">
                {/* Top Section: Create Post Box */}
                <section>
                    <CreatePost />
                </section>

                {/* Feed Section */}
                <section>
                    <FeedList />
                </section>
            </div>
        </div>
    )
}