import { ChangeEvent, useEffect, useState } from 'react'
import { createClient } from "@/utils/supabase/client"
import Image from 'next/image';

interface AvatarProps {
  url: string;
  size: number;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>, filePath: string) => void;
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient();

  useEffect(() => {
    if (url) {
      downloadImage(url);
    }
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      } else {
        console.log('Error downloading image: ', error)
      }
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred.')
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          width={size}
          height={size}
          className="avatar image mt-2"
        />
      ) : (
        <div className="avatar no-image hidden" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="button primary block cursor-pointer mt-2" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload image'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}