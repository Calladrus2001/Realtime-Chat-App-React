import client from "./_init";
import localStorageService from "./localStorageService";

//? This is the contactService class which deals with adding and fetching contacts.
//? As mentioned in the documentation, only those contacts which are registered will be allowed to be included in a group

class ContactService {
  constructor() {
    this.client = client
  }

  async getAllContacts({ userId }) {
    const cacheData = localStorageService.fetchData({
      key: "contacts",
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
    if (cacheData) return cacheData;

    const { data, error } = await this.client
      .from("contacts")
      .select("id, contact_email, contact_name, contact_id")
      .eq("user_id", userId)
      .neq("contact_id", null);

    if (error) throw Error(error);

    localStorageService.setData({ key: "contacts", data: data });
    return data;
  }

  async addContact({ userId, email, nickname }) {
    const { data, error } = await this.client
      .from("contacts")
      .insert([{ user_id: userId, contact_name: nickname, contact_email: email }]);

    if (error) throw new Error(error.message);

    localStorageService.removeData("contacts");
    return data;
  }
}

const contactService = new ContactService();
export default contactService;