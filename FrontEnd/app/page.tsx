'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createChatRoom, joinChatRoom } from '@/lib/api'

export default function Home() {
  const [createPassword, setCreatePassword] = useState('')
  const [joinLink, setJoinLink] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (createPassword) {
      const result = await createChatRoom(createPassword)
      if (result.success) {
        router.push(`/chat-room/${result.roomId}`)
      } else {
        toast({
          title: "Error",
          description: "Failed to create chat room",
          variant: "destructive",
        })
      }
    }
  }

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (joinLink && joinPassword) {
      const result = await joinChatRoom(joinLink, joinPassword)
      if (result.success) {
        router.push(`/chat-room/${joinLink}`)
      } else {
        toast({
          title: "Error",
          description: "Failed to join chat room",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-bold text-gray-800">ChatApp</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
            <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Chat</TabsTrigger>
              <TabsTrigger value="join">Join Chat</TabsTrigger>
            </TabsList>
            <CardContent className="mt-4">
              <TabsContent value="create">
                <h2 className="text-2xl font-bold mb-2">Create a New Chat</h2>
                <p className="text-gray-600 mb-4">Set a password and generate a unique link to start a new chat room.</p>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Set chat room password"
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    className="w-full"
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                    Generate Chat Link
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="join">
                <h2 className="text-2xl font-bold mb-2">Join a Chat</h2>
                <p className="text-gray-600 mb-4">Enter the chat link and password to join an existing room.</p>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter chat link"
                    value={joinLink}
                    onChange={(e) => setJoinLink(e.target.value)}
                    className="w-full"
                  />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    value={joinPassword}
                    onChange={(e) => setJoinPassword(e.target.value)}
                    className="w-full"
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                    Join Chat
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  )
}