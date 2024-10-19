'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Copy, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { createChatRoom, joinChatRoom } from '@/lib/api'
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const [createPassword, setCreatePassword] = useState('')
  const [joinLink, setJoinLink] = useState('')
  const [joinPassword, setJoinPassword] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (createPassword) {
      const result = await createChatRoom(createPassword)
      if (result.success) {
        const fullLink = `${window.location.origin}/chat-room/${result.roomId}`
        setGeneratedLink(fullLink)
        toast({
          title: "Room Created",
          description: "Your chat room has been successfully created.",
        })
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
      try {
        // Extract the room ID from the join link
        const roomId = joinLink.split('/').pop()
        if (!roomId) {
          throw new Error('Invalid chat link')
        }

        const result = await joinChatRoom(roomId, joinPassword)
        if (result.success) {
          toast({
            title: "Success",
            description: "Joined chat room successfully",
            variant: "default",
          })
          router.push(`/chat-room/${roomId}`)
        } else {
          throw new Error(result.error || 'Failed to join chat room')
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to join chat room",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "Error",
        description: "Please enter both chat link and password",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopied(true)
    toast({
      title: "Copied",
      description: "Link copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
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
                {generatedLink && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="w-full"
                      />
                      <Button onClick={copyToClipboard} variant="outline" size="icon">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button 
                      onClick={() => router.push(generatedLink)}
                      className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                    >
                      Join Chat Room
                    </Button>
                  </div>
                )}
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
      <Toaster />
    </div>
  )
}
