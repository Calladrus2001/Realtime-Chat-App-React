// import { supabaseAnonKey } from "../lib/config";
import client from "./_init";
import localStorageService from "./localStorageService";
import { v4 as uuidv4 } from "uuid";

class ChatService {
  constructor() {
    this.client = client;
  }

  //? Methods dealing with channels
  async fetchChannels(userId) {
    const cacheData = localStorageService.fetchData({
      key: "channels",
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
    if (cacheData) return cacheData;

    const { data, error } = await this.client
      .from("participants")
      .select("user_id, channels (*)")
      .eq("user_id", userId);

    if (error) throw new Error(error);

    localStorageService.setData({ key: "channels", data });
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

    localStorageService.removeData("channels");
    return channelData;
  }

  async _addChannelParticipant({ channel_id, user_id }) {
    const { error } = await this.client
      .from("participants")
      .insert([{ channel_id, user_id }]);

    if (error) throw new Error(error);
  }

  //? Methods dealing with messages
  subscribeToChannel({ channelId, setMessages, user }) {
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
          // Refer to key design decisions pt2 to understand the purpose of next line
          if (newMessage.user_id !== user.id)
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
  }

  unsubscribeFromAll() {
    this.client.removeAllChannels();
  }

  async createMessage({ message, userId, channelId, file, setMessages }) {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: uuidv4(),
        message,
        localUrl: file ? URL.createObjectURL(file) : null,
        inserted_at: Date.now(),
        user_id: userId,
      },
    ]);
    const imageData = file ? await chatService._uploadMedia({ file, channelId }) : null;
    const { data, error } = await this.client
      .from("messages")
      .insert([{ message, user_id: userId, channel_id: channelId, imgurl: imageData?.path }])
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

  //? Methods dealing with Media
  async _uploadMedia({ file, channelId }) {
    const name = uuidv4();
    const { data, error } = await this.client.storage
      .from("media")
      .upload(`${channelId}/${name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw new Error(error);
    return data;
  }

  fetchDownloadUrl({ imgUrl }) {
    const { data } = this.client.storage.from("media").getPublicUrl(imgUrl);

    return data;
  }
}

const chatService = new ChatService();
export default chatService;
