import { supabaseAnonKey } from "../lib/config";
import { createClient } from "@supabase/supabase-js";

class AuthService {
  constructor() {
    this.client = createClient(
      "https://kywzezpajriiswaklxpi.supabase.co",
      supabaseAnonKey
    );
  }

  async signUp({ email, password }) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    return data;
  }

  async signIn({ email, password }) {
    const { user, error } = await this.client.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw new Error(error.message);

    return user;
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
}

const authService = new AuthService();
export default authService;