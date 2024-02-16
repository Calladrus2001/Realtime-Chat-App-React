import { createClient } from "@supabase/supabase-js";

class ContactService {
  constructor() {
    this.client = createClient(
      "https://kywzezpajriiswaklxpi.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5d3plenBhanJpaXN3YWtseHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1Nzc4NDIsImV4cCI6MjAyMzE1Mzg0Mn0.49XWBVpGpWgoRBVdH2NqnfTprBNErhVAiabOubexIAQ"
    );
  }

  async fetchAllContacts({ userId }) {
    const { data, error } = await this.client
      .from("contacts")
      .select("user_id, contact_name")
      .eq("user_id", userId);

    if (error) throw Error(error);
    return data;
  }

  async addContact({ userId, email, nickname }) {
    const { data, error } = await this.client
      .from("contacts")
      .insert([
        { user_id: userId, contact_name: nickname, contact_email: email },
      ]);

    if (error) throw new Error(error.message);
    return data;
  }
}

const contactService = new ContactService();
export default contactService;
