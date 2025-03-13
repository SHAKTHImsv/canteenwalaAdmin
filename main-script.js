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

  function fetchMenuItems(canteenName, subCanteenName) {
    document.querySelector(".cards").style.display = "none";
  
    const itemsRef = ref(database, 'items');  // Reference to items in the database
  
    // Fetch all items from the database
    get(itemsRef).then((snapshot) => {
      if (snapshot.exists()) {
        menuItems.innerHTML = ''; // Clear existing items
  
        snapshot.forEach((itemSnapshot) => {
          const itemData = itemSnapshot.val();
  
          // Check if the itemData and items array exist
          if (itemData && itemData.items && Array.isArray(itemData.items)) {
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
          } else {
            console.warn('Item data is missing or not an array: ', itemSnapshot.key);
          }
        });
  
        document.querySelectorAll('.delete-btn').forEach((button) => {
          button.addEventListener('click', function () {
            const itemId = this.getAttribute('data-item-id');
            const itemIndex = this.getAttribute('data-item-index');
            const itemCard = this.closest('.sub-cards');  // Get the card element
        
            // Delete the item from Firebase and hide the card
            deleteItem(itemId, itemIndex, itemCard);
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
  function deleteItem(itemId, itemIndex, itemCard) {
    const itemRef = ref(database, 'items/' + itemId + '/items/' + itemIndex);  // Reference to the specific item
    remove(itemRef).then(() => {
      console.log("Item deleted successfully");
  
      // Hide the item card from the UI
      itemCard.style.display = 'none'; // Hides the card without reloading the page
  
      // After deleting an item, check if the items array is empty
      const itemsRefAfterDeletion = ref(database, 'items/' + itemId + '/items'); // Reference to the items array
      get(itemsRefAfterDeletion).then((snapshot) => {
        if (snapshot.exists()) {
          const itemsArray = snapshot.val();
  
          // If no items are left, delete the entire item node (itemId)
          if (itemsArray.length === 0) {
            deleteItemNode(itemId); // Delete the entire node if the array is empty
          }
        }
      }).catch((error) => {
        console.error("Error checking items after deletion: ", error);
      });
  
    }).catch((error) => {
      console.error("Error deleting item: ", error);
    });
  }
  

  // Function to delete the entire node if items array is empty
  function deleteItemNode(itemId) {
    const itemParentRef = ref(database, 'items/' + itemId); // Reference to the parent node (itemId)
    remove(itemParentRef).then(() => {
      console.log("Item node deleted because all items were removed");
      fetchMenuItems('mainCanteen', 'Mustard Cafe'); // Refresh the menu after deletion
    }).catch((error) => {
      console.error("Error deleting the item node: ", error);
    });
  }

  // Event listeners for each cafe
  mustard.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Mustard Cafe'));
  cucumber.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Cucumber Cafe'));
  canteen.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Saffron Cafe'));
  cinnamon.addEventListener('click', () => fetchMenuItems('mainCanteen', 'Cinnamon Cafe'));
});
