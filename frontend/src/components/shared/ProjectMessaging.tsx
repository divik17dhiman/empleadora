import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Send, 
  Paperclip, 
  Image, 
  Video, 
  Phone, 
  VideoIcon, 
  MoreVertical,
  Download,
  CheckCheck,
  Clock,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isTranslated?: boolean;
  originalLanguage?: string;
  translatedText?: string;
}

interface ProjectMessagingProps {
  projectId: string;
  projectTitle: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    role: 'client' | 'freelancer';
    isOnline: boolean;
    lastSeen?: Date;
  }[];
  currentUserId: string;
  onSendMessage?: (content: string, type: string, fileData?: File) => void;
  onStartCall?: (type: 'audio' | 'video') => void;
}

const sampleMessages: Message[] = [
  {
    id: '1',
    senderId: 'client1',
    senderName: 'Rajesh Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    content: 'Hi Priya! I\'ve reviewed your portfolio and I\'m excited to work with you on this project.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: 'text',
    status: 'read'
  },
  {
    id: '2',
    senderId: 'freelancer1',
    senderName: 'Priya Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    content: 'धन्यवाद! मैं इस प्रोजेक्ट पर काम करने के लिए उत्साहित हूं। क्या आप मुझे requirements के बारे में और बता सकते हैं?',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    type: 'text',
    status: 'read',
    isTranslated: true,
    originalLanguage: 'Hindi',
    translatedText: 'Thank you! I\'m excited to work on this project. Can you tell me more about the requirements?'
  },
  {
    id: '3',
    senderId: 'client1',
    senderName: 'Rajesh Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    content: 'Of course! I\'ve attached the project brief with all the details.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: 'file',
    status: 'read',
    fileUrl: '/project-brief.pdf',
    fileName: 'Mobile_App_Requirements.pdf',
    fileSize: 2048576
  },
  {
    id: '4',
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '',
    content: 'Escrow payment of ₹85,000 has been successfully funded. You can now start working on the project.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'system',
    status: 'delivered'
  },
  {
    id: '5',
    senderId: 'freelancer1',
    senderName: 'Priya Sharma',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    content: 'Perfect! I\'ll review the brief and share initial wireframes by tomorrow.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'text',
    status: 'read'
  }
];

export function ProjectMessaging({
  projectId,
  projectTitle,
  participants,
  currentUserId,
  onSendMessage,
  onStartCall
}: ProjectMessagingProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        content: newMessage.trim(),
        timestamp: new Date(),
        type: 'text',
        status: 'sending'
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
      onSendMessage?.(newMessage.trim(), 'text');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: 'You',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        content: `Shared ${file.name}`,
        timestamp: new Date(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        status: 'sending',
        fileName: file.name,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file)
      };
      
      setMessages([...messages, message]);
      onSendMessage?.(file.name, message.type, file);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending': return <Clock size={12} className="text-gray-400" />;
      case 'sent': return <CheckCheck size={12} className="text-gray-400" />;
      case 'delivered': return <CheckCheck size={12} className="text-blue-500" />;
      case 'read': return <CheckCheck size={12} className="text-green-500" />;
      default: return null;
    }
  };

  const otherParticipant = participants.find(p => p.id !== currentUserId);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherParticipant?.avatar} />
              <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{otherParticipant?.name}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  otherParticipant?.isOnline ? "bg-green-500" : "bg-gray-400"
                )} />
                {otherParticipant?.isOnline ? 'Online' : 'Last seen 2h ago'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => onStartCall?.('audio')}>
              <Phone size={16} />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onStartCall?.('video')}>
              <VideoIcon size={16} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShowTranslation(!showTranslation)}>
                  <Languages className="mr-2" size={14} />
                  {showTranslation ? 'Hide' : 'Show'} Translations
                </DropdownMenuItem>
                <DropdownMenuItem>
                  View Project Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              const isSystem = message.type === 'system';
              
              if (isSystem) {
                return (
                  <div key={message.id} className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      {message.content}
                    </Badge>
                  </div>
                );
              }

              return (
                <div key={message.id} className={cn("flex gap-3", isOwn && "flex-row-reverse")}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
                    <div className={cn(
                      "rounded-lg px-3 py-2",
                      isOwn 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary"
                    )}>
                      {message.type === 'text' && (
                        <div>
                          <p className="text-sm">{message.content}</p>
                          {message.isTranslated && showTranslation && (
                            <div className="mt-2 pt-2 border-t border-white/20">
                                                          <div className="flex items-center gap-1 mb-1">
                              <Languages size={12} />
                              <span className="text-xs opacity-70">
                                Translated from {message.originalLanguage}
                              </span>
                            </div>
                              <p className="text-sm opacity-90">{message.translatedText}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {message.type === 'file' && (
                        <div className="flex items-center gap-2">
                          <Paperclip size={16} />
                          <div>
                            <p className="text-sm font-medium">{message.fileName}</p>
                            <p className="text-xs opacity-70">
                              {message.fileSize && formatFileSize(message.fileSize)}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Download size={12} />
                          </Button>
                        </div>
                      )}
                      
                      {message.type === 'image' && (
                        <div>
                          <img 
                            src={message.fileUrl} 
                            alt={message.fileName}
                            className="max-w-full rounded"
                          />
                          <p className="text-xs mt-1 opacity-70">{message.fileName}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className={cn(
                      "flex items-center gap-1 mt-1 text-xs text-muted-foreground",
                      isOwn && "flex-row-reverse"
                    )}>
                      <span>{formatTimestamp(message.timestamp)}</span>
                      {isOwn && getStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={otherParticipant?.avatar} />
                  <AvatarFallback>{otherParticipant?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Paperclip size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="mr-2" size={14} />
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                  <Image className="mr-2" size={14} />
                  Upload Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Input
              placeholder="Type your message... (Hindi/English supported)"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            
            <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send size={16} />
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </div>
      </CardContent>
    </Card>
  );
}
