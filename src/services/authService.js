// import supabaseAnonKey from "../lib/config";
import { createClient } from "@supabase/supabase-js";

class AuthService {
  constructor() {
    this.client = createClient(
      "https://kywzezpajriiswaklxpi.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5d3plenBhanJpaXN3YWtseHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1Nzc4NDIsImV4cCI6MjAyMzE1Mzg0Mn0.49XWBVpGpWgoRBVdH2NqnfTprBNErhVAiabOubexIAQ"
    );
  }

  async signUp({ email, password }, name) {
    const { data, signUpError } = await this.client.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw new Error(signUpError.message);

    const { _, updateError } = await this.client.auth.updateUser({
      data: { display_name: name }
    });

    if (updateError) throw new Error(updateError.message);
    this._updateContacts({ email, userId: data.user.id });

    return data;
  }

  async signIn({ email, password }) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) throw new Error(error.message);
    this._updateContacts({ email, userId: data.user.id });
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut({ scope: "local" });
    if (error) throw new Error(error.message);
  }

  async getCurrentUser() {
    const { data, error } = await this.client.auth.getUser();
    if (error) throw new Error(error.message);

    return data;
  }

  async _updateContacts({ email, userId }) {
    const { error } = await this.client
      .from("contacts")
      .update({ contact_id: String(userId) })
      .eq("contact_email", email)
      .is("contact_id", null);

    if (error) throw Error(error);
  }
}

const authService = new AuthService();
export default authService;
