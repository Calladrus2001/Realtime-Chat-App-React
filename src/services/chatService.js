// import { supabaseAnonKey } from "../lib/config";
import { createClient } from "@supabase/supabase-js";

class ChatService {
  constructor() {
    this.client = createClient(
      "https://kywzezpajriiswaklxpi.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5d3plenBhanJpaXN3YWtseHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1Nzc4NDIsImV4cCI6MjAyMzE1Mzg0Mn0.49XWBVpGpWgoRBVdH2NqnfTprBNErhVAiabOubexIAQ"
    );
  }

  async fetchChannels(userId) {
    const { data, error } = await this.client
      .from("participants")
      .select("user_id, channels (*)")
      .eq("user_id", userId);

    if (error) throw new Error(error);
    return data;
  }

  async createChannel({ slug, createdBy, type, participants }) {
    const { data: channelData, error: channelError } = await this.client
      .from("channels")
      .insert([{ slug, created_by: createdBy, type }])
      .select();

    if (channelError) throw new Error(channelError);
    const channelId = channelData[0].id;
    participants.push(createdBy);

    for (const participant of participants) {
      await this._addChannelParticipant({
        channel_id: channelId,
        user_id: participant,
      });
    }

    return channelData;
  }

  async _addChannelParticipant({ channel_id, user_id }) {
    const { error } = await this.client
      .from("participants")
      .insert([{ channel_id, user_id }]);

    if (error) throw new Error(error);
  }

  subscribeToChannel({ channelId, setMessages }) {
    this.client
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        (payload) => {
          const newMessage = payload.new;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
  }

  unsubscribeFromAll() {
    this.client.removeAllChannels();
  }

  async createMessage({ message, userId, channelId }) {
    const { data, error } = await this.client
      .from("messages")
      .insert([{ message: message, user_id: userId, channel_id: channelId }])
      .select();

    if (error) throw new Error(error);
    return data;
  }

  async fetchMessages({ channelId }) {
    const { data, error } = await this.client
      .from("messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("inserted_at", { ascending: true });

    if (error) throw new Error(error);
    return data;
  }
}

const chatService = new ChatService();
export default chatService;