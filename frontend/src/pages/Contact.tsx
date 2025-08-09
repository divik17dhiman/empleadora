import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast'; // Optional toast hook
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import the SDK

type ChatEntry = {
  text: string;
  sender: 'user' | 'bot';
  feedbackGiven?: boolean;
};

// --- New Function to Call Gemini API ---
const getGeminiReply = async (userInput: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key is not set in environment variables.");
    return "Sorry, my connection to the AI service is not configured correctly.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful support bot for Empleadora, a freelancing platform.
Your goal is to assist users with questions about the platform.
Keep answers concise, clear, and under 60 words.

Facts about Empleadora:

All freelancers are verified and skilled. Users can view profiles and reviews before hiring.

To hire, visit a freelancer’s profile and click "Hire Now" or send a direct message.

Payments are processed securely through Empleadora and released only when the work is confirmed complete.

For direct support, email dkrdanet@gmail.com.

Now, please answer the following user question: "${userInput}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching Gemini reply:", error);
    return "Oops! I'm having a little trouble thinking right now. Please try again in a moment.";
  }
};


// --- The Main Component (with modifications) ---
const ChatMessage = ({
  message,
  sender,
  feedbackGiven,
  onFeedback,
}: {
  message: string;
  sender: 'user' | 'bot';
  feedbackGiven?: boolean;
  onFeedback?: (type: 'up' | 'down') => void;
}) => (
  <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
    <div
      className={`px-4 py-2 rounded-2xl max-w-xs ${
        sender === 'user'
          ? 'bg-primary text-primary-foreground rounded-br-none' // Adjusted for better contrast
          : 'bg-muted text-foreground rounded-bl-none'
      }`}
    >
      <div>{message}</div>
      {sender === 'bot' && onFeedback && !feedbackGiven && (
        <div className="flex justify-end gap-2 mt-2 text-muted-foreground text-sm">
          <button onClick={() => onFeedback('up')} aria-label="Thumbs up">
            <ThumbsUp size={16} />
          </button>
          <button onClick={() => onFeedback('down')} aria-label="Thumbs down">
            <ThumbsDown size={16} />
          </button>
        </div>
      )}
      {feedbackGiven && (
        <div className="text-xs text-right mt-2 text-green-500">Thanks for the feedback!</div>
      )}
    </div>
  </div>
);

const Contact = () => {
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      text: 'Hi! I’m your freelance assistant bot. Ask me anything about the site or freelancers.',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatEntry = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    const currentInput = input;
    setInput(''); // Clear input immediately for better UX

    // Get the bot's reply from the Gemini API
    const reply = await getGeminiReply(currentInput);

    const botMsg: ChatEntry = { text: reply, sender: 'bot', feedbackGiven: false };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, feedbackGiven: true } : msg
      )
    );

    toast({
      title: 'Thanks for your feedback!',
      description: type === 'up'
        ? 'Glad I could help! 👍'
        : 'Noted. I’m always learning. 👀',
    });

    console.log(`Feedback on message #${index}: ${type}`);
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-2xl">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Chat with Support Bot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-2 border rounded-md bg-muted/50">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  message={msg.text}
                  sender={msg.sender}
                  feedbackGiven={msg.feedbackGiven}
                  onFeedback={
                    msg.sender === 'bot' && !msg.feedbackGiven
                      ? (type) => handleFeedback(idx, type)
                      : undefined
                  }
                />
              ))}
              {isTyping && (
                <div className="text-muted-foreground text-sm italic p-2">Bot is typing...</div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={isTyping || !input.trim()}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;