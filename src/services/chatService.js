import { supabaseAnonKey } from "../lib/config";
import { createClient } from "@supabase/supabase-js";

class ChatService {
  constructor() {
    this.client = createClient(
      "https://kywzezpajriiswaklxpi.supabase.co",
      supabaseAnonKey
    );
  }

  async createChannel(slug, createdBy) {
    //? Adding the channel and the user as a participant to that channel

    const { data: channelData, error: channelError } = await this.client
      .from("channels")
      .insert([{ slug, created_by: createdBy }]);

    if (channelError) throw Error(channelError);
    const channelId = channelData[0].id;

    const { error: participantError } = await this.client
      .from("channel_participants")
      .insert([{ channel_id: channelId, user_id: createdBy }]);

    if (participantError) throw Error(participantError);

    return channelData;
  }

  async createMesssage({ message, userId, channelId }) {
    const { error } = await this.client
      .from("messages")
      .insert([{ message: message, user_id: userId, channel_id: channelId }]);

    if (error) throw Error(error);
  }

  async fetchChannels(userId) {
    const { data, error } = await this.client
      .from("channels")
      .select("channels.*")
      .innerJoin("channel_participants", {
        "channels.id": "channel_participants.channel_id",
      })
      .eq("channel_participants.user_id", userId);

    if (error) throw Error(error);
    return data;
  }

  async fetchMessages(channelId) {
    const { data, error } = await this.client
      .from("messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("inserted_at", { ascending: true });

    if (error) throw Error(error);
    return data;
  }
}

const chatService = new ChatService();
export default chatService;
