import React from "react";
import { Checkbox } from "./ui/checkbox";
function CheckboxList({ contacts, setselectedContact }) {
  const onCheckboxChange = (contactId) => {
    setselectedContact((prevSelectedContacts) => {
      // Check if the contactId is already in the selectedContacts array
      const contactIndex = prevSelectedContacts.indexOf(contactId);
      if (contactIndex === -1) {
        // If not found, add it to the array
        return [...prevSelectedContacts, contactId];
      } else {
        // If found, remove it from the array
        return prevSelectedContacts.filter((id) => id !== contactId);
      }
    });
  };

  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Checkbox onChange={() => onCheckboxChange(contact.id)} />
          {contact.contact_email}
        </li>
      ))}
    </ul>
  );
}

export default CheckboxList;
