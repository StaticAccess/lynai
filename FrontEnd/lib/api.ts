import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',  
  withCredentials: false,
})

export const createChatRoom = async (password: string) => {
  try {
    const response = await api.post('/create-room', { password })
    return {success: true, roomId: response.data.roomId}
  } catch (error) {
    console.error('Error creating chat room:', error)
    return { success: false, error: 'Failed to create chat room' }
  }
}

export const joinChatRoom = async (roomId: string, password: string) => {
  try {
    const response = await api.post('/join-room', { roomId, password })
    return response.data
  } catch (error) {
    console.error('Error joining chat room:', error)
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data
    }
    return { success: false, error: 'Failed to join chat room' }
  }
}

export const getMessages = async (roomId: string) => {
  try {
    const response = await api.get(`/messages/${roomId}`)
    return response.data
  } catch (error) {
    console.error('Error getting messages:', error)
    return { success: false, error: 'Failed to get messages' }
  }
}

export const sendMessage = async (roomId: string, content: string, username: string) => {
  try {
    const response = await api.post(`/messages/${roomId}`, { content, username })
    return response.data
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: 'Failed to send message' }
  }
}

export const changeUsername = async (roomId: string, newUsername: string) => {
  try {
    const response = await api.post(`/change-username/${roomId}`, { newUsername })
    return response.data
  } catch (error) {
    console.error('Error changing username:', error)
    return { success: false, error: 'Failed to change username' }
  }
}

export const setDeleteTimer = async (roomId: string, duration: string) => {
  try {
    const response = await api.post(`/set-delete-timer/${roomId}`, { duration })
    return response.data
  } catch (error) {
    console.error('Error setting delete timer:', error)
    return { success: false, error: 'Failed to set delete timer' }
  }
}

export const downloadChat = async (roomId: string, format: 'txt' | 'json') => {
  try {
    const response = await api.get(`/download-chat/${roomId}`, {
      params: { format },
      responseType: 'blob',
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `chat_${roomId}.${format}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    return { success: true }
  } catch (error) {
    console.error('Error downloading chat:', error)
    return { success: false, error: 'Failed to download chat' }
  }
}
