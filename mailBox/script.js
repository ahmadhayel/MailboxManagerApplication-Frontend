const apiUrl = "http://localhost:8080/senders";

// Function to create a new sender
function createSender() {
  const name = document.getElementById("name").value;
  const companyName = document.getElementById("companyName").value;

  fetch(`${apiUrl}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, companyName }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New sender created:", data);
      // Clear input fields
      document.getElementById("name").value = "";
      document.getElementById("companyName").value = "";
      // Refresh sender list
      getAllSenders();
    })
    .catch((error) => console.error("Error creating sender:", error));
}

// Function to delete a sender by ID
function deleteSender() {
  const senderId = document.getElementById("deleteId").value;

  fetch(`${apiUrl}/${senderId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Sender with ID ${senderId} deleted successfully.`);
        // Refresh sender list
        getAllSenders();
      } else {
        throw new Error(`Failed to delete sender with ID ${senderId}.`);
      }
    })
    .catch((error) => console.error(error));

  // Clear input field after deletion
  document.getElementById("deleteId").value = "";
}

// Function to get all senders
function getAllSenders() {
  fetch(`${apiUrl}/all`)
    .then((response) => response.json())
    .then((data) => {
      console.log("All senders:", data);
      // Display senders list
      displaySenders(data);
    })
    .catch((error) => console.error("Error fetching senders:", error));
}

// Function to display senders list
function displaySenders(senders) {
  const sendersList = document.getElementById("sendersList");
  sendersList.innerHTML = ""; // Clear previous list

  senders.forEach((sender) => {
    const senderItem = document.createElement("div");
    senderItem.innerHTML = `
            <p>ID: ${sender.id}</p>
            <p>Name: ${sender.name}</p>
            <p>Company Name: ${sender.companyName}</p>
        `;
    sendersList.appendChild(senderItem);
  });
}

// Load senders when the page loads
window.onload = getAllSenders;

document.addEventListener("DOMContentLoaded", function () {
  const addRecipientForm = document.getElementById("addRecipientForm");
  const deleteRecipientForm = document.getElementById("deleteRecipientForm");
  const recipientList = document.getElementById("recipientList");

  // Function to fetch all recipients from backend
  function fetchRecipients() {
    fetch("http://localhost:8080/recipients/all")
      .then((response) => response.json())
      .then((data) => {
        recipientList.innerHTML = "";
        data.forEach((recipient) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${recipient.name} - ${recipient.email}`;
          recipientList.appendChild(listItem);
        });
      })
      .catch((error) => console.error("Error fetching recipients:", error));
  }

  // Fetch recipients on page load
  fetchRecipients();

  // Event listener for add recipient form submission
  addRecipientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(addRecipientForm);
    const recipientData = {
      name: formData.get("name"),
      email: formData.get("email"),
    };

    fetch("http://localhost:8080/recipients/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipientData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Recipient created:", data);
        fetchRecipients(); // Refresh recipient list
        addRecipientForm.reset(); // Reset form fields
      })
      .catch((error) => console.error("Error creating recipient:", error));
  });

  // Event listener for delete recipient form submission
  deleteRecipientForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const recipientId = formData.get("id");

    fetch(`http://localhost:8080/recipients/${recipientId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to delete recipient.");
        }
        console.log("Recipient deleted successfully.");
        // Uppdatera mottagarlistan efter borttagning
        fetchRecipients();
        deleteRecipientForm.reset(); // Reset delete form
      })
      .catch((error) => console.error("Error deleting recipient:", error));
  });
});
/*gggg*/
document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var fileInput = document.getElementById("fileInput");
    var senderIdsInput = document.getElementById("senderIds");
    var recipientIdsInput = document.getElementById("recipientIds");
    var formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("senderIds", senderIdsInput.value);
    formData.append("recipientIds", recipientIdsInput.value);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8080/uploadFilesIntoDB"); // Uppdatera URL:en här
    xhr.onload = function () {
      if (xhr.status === 200) {
        document.getElementById("message").textContent =
          "File uploaded successfully!";
      } else {
        document.getElementById("message").textContent =
          "Failed to upload file: " + xhr.responseText;
      }
    };
    xhr.send(formData);
  });

function deleteFile(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8080/messages/" + id); // Uppdatera URL:en här
  xhr.onload = function () {
    if (xhr.status === 204) {
      document.getElementById("message").textContent =
        "File deleted successfully!";
      // Du kan lägga till logik här för att uppdatera gränssnittet om det behövs
    } else {
      document.getElementById("message").textContent =
        "Failed to delete file: " + xhr.responseText;
    }
  };
  xhr.send();
}
