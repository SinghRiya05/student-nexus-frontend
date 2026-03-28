import React from 'react'
import EditProfileSection from '@/components/main/profile/EditProfileSection'

export const metadata = {
  title: 'Edit Profile | StudentNexus',
  description: 'Update your student profile on StudentNexus',
}

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-[#fcf8ff]">
      <EditProfileSection />
    </div>
  )
}
