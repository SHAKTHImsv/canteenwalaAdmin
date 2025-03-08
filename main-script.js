import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7gqwik4wavvokkCMHR8RzonMfhgEfRYA",
  authDomain: "canteen-ee9be.firebaseapp.com",
  projectId: "canteen-ee9be",
  storageBucket: "canteen-ee9be.appspot.com",
  messagingSenderId: "216018272764",
  appId: "1:216018272764:web:fe4f9dcdfe7bb88070b279",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener('DOMContentLoaded', function () {
  const mustard = document.getElementById('Mustard');
  const cucumber = document.getElementById('Cucumber');
  const canteen = document.getElementById('Canteen');
  const cinnamon = document.getElementById('Cinnamon');
  const menuItems = document.getElementById('menu-items');

  // Function to fetch menu items for the selected cafe
  function fetchMenuItems(canteenName, subCanteenName) {
    document.querySelector(".cards").style.display = "none";

    const itemsRef = ref(database, 'items');  // Reference to items in the database

    // Fetch all items from the database
    get(itemsRef).then((snapshot) => {
      if (snapshot.exists()) {
        menuItems.innerHTML = ''; // Clear existing items

        snapshot.forEach((itemSnapshot) => {
          const itemData = itemSnapshot.val();

          // Check if the canteen and subCanteen match the selected cafe
          if (itemData.canteen === canteenName && itemData.subCanteen === subCanteenName) {
            // Loop through the items array and display them
            itemData.items.forEach((item, index) => {
              menuItems.innerHTML += `
                <div class="sub-cards">
                  <div class="sub-card1 flex bg-black p-4 text-white flex-col gap-5 my-3">
                    <h1 class="text-center text-2xl">${item.itemName}</h1>
                    <h2 class="text-center text-1xl">Price: ${item.itemPrice}</h2>
                    <button class="delete-btn bg-red-500 py-2" data-item-id="${itemSnapshot.key}" data-item-index="${index}">Delete</button>
                  </div>
                </div>
              `;
            });
          }
        });

        // Add delete event listeners to all delete buttons
        document.querySelectorAll('.delete-btn').forEach((button) => {
          button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            const itemIndex = this.getAttribute('data-item-index');

            // Delete the item from Firebase
            deleteItem(itemId, itemIndex);
          });
        });

      } else {
        menuItems.innerHTML = "No items available in the selected canteen.";
      }
    }).catch((error) => {
      console.error("Error fetching data from Firebase: ", error);
      menuItems.innerHTML = "Error fetching menu items. Please try again.";
    });
  }

  // Function to delete an item from Firebase
  function deleteItem(itemId, itemIndex) {
    const itemRef = ref(database, 'items/' + itemId + '/items/' + itemIndex);  // Reference to the specific item
    remove(itemRef).then(() => {
      console.log("Item deleted successfully");
      // Refresh the menu to reflect the changes
      fetchMenuItems('mainCanteen', 'Mustard Cafe');
    }).catch((error) => {
      console.error("Error deleting item: ", error);
    });
  }

  // Event listeners for each cafe
  mustard.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Mustard Cafe'));
  cucumber.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Cucumber Cafe'));
  canteen.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Saffron Cafe'));
  cinnamon.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Cinnamon Cafe'));
});
