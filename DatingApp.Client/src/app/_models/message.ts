export interface Message {
    id: number
    senderUsername: string
    senderPhotoUrl: string
    senderId: number
    recipientUsername: string
    recipientPhotoUrl: string
    recipientId: number
    content: string
    dateRead?: Date
    messageSent: Date
  }