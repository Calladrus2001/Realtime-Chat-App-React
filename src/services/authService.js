// import supabaseAnonKey from "../lib/config";
import { createClient } from "@supabase/supabase-js";

class AuthService {
  constructor() {
    this.client = createClient(
      "https://kywzezpajriiswaklxpi.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5d3plenBhanJpaXN3YWtseHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc1Nzc4NDIsImV4cCI6MjAyMzE1Mzg0Mn0.49XWBVpGpWgoRBVdH2NqnfTprBNErhVAiabOubexIAQ"
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
      password: password,
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
