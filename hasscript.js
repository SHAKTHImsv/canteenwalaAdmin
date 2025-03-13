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

// Define the menu container to avoid the "menu is not defined" error
const menu = document.getElementById("menu-items");

document.addEventListener("DOMContentLoaded", function () {
    const Himalayan = document.getElementById("Himalayan");
    const Marina = document.getElementById("Marina");
    const Tanjore = document.getElementById("Tanjore");
    const Neelagiri = document.getElementById("Neelagiri");
    const Madurai = document.getElementById("Madurai");
    const Trichy = document.getElementById("Trichy");
    const Vivekanandha = document.getElementById("Vivekanandha");

    // Event listeners for each sub-canteen (sub-cards)
    Himalayan.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Himalayan'));
    Marina.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Marina'));
    Neelagiri.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Neelagiri'));
    Vivekanandha.addEventListener("click", () => fetchMenuItems('hostelCanteen', 'Vivekanandha'));
});

// Function to fetch menu items based on the canteen (main) and sub-canteen
function fetchMenuItems(canteenName, subCanteenName) {
    const menu = document.getElementById("menu-items");
    document.querySelector(".cards").style.display = "none"; // Hide the cards when displaying menu items

    const itemRef = ref(database, 'items'); // Reference to the "items" node in Firebase
    get(itemRef).then((snapshot) => {
        if (snapshot.exists()) {
            menu.innerHTML = ''; // Clear previous menu items
            snapshot.forEach((itemSnapshot) => {
                const itemdata = itemSnapshot.val();
                const itemId = itemSnapshot.key; // Get the unique item ID

                // Ensure the itemdata has the right structure
                if (itemdata && itemdata.items) {
                    // Only proceed if the canteen is "Hostel Canteen" and the subCanteen matches the clicked one
                    if (itemdata.canteen === canteenName && itemdata.subCanteen.toLowerCase().includes(subCanteenName.toLowerCase())) {

                        // Loop through the items and display each one
                        itemdata.items.forEach((item, index) => {
                            menu.innerHTML += `
                                <div class="sub-cards" id="item-${itemId}-${index}">
                                    <div class="sub-card1 sub-card1 flex bg-black p-4 text-white flex-col gap-5 my-3">
                                        <h1 class="text-center text-2xl">${item.itemName}</h1>
                                        <h2 class="text-center text-1xl">Price: ₹${item.itemPrice}</h2>
                                        <button class="delete-btn bg-red-500 py-2" data-item-id="${itemId}" data-item-index="${index}">Delete</button>
                                    </div>
                                </div>
                            `;
                        });
                    }
                }
            });

            // Add event listeners for delete buttons after they are created
            document.querySelectorAll('.delete-btn').forEach((button) => {
                button.addEventListener('click', function () {
                    const itemId = this.getAttribute('data-item-id');
                    const itemIndex = this.getAttribute('data-item-index');

                    // Delete the item from Firebase
                    deleteItem(itemId, itemIndex);
                });
            });
        } else {
            console.log('No data found.');
            menu.innerHTML = "<p>No menu items available for this sub-canteen.</p>";
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
        menu.innerHTML = "<p>Error fetching data. Please try again later.</p>"; // Display an error message
    });
}

// Function to delete an item from Firebase
function deleteItem(itemId, itemIndex) {
    const itemRef = ref(database, 'items/' + itemId + '/items/' + itemIndex);  // Reference to the specific item
    remove(itemRef).then(() => {
        console.log("Item deleted successfully");

        // After deletion, we need to check if the 'items' array is empty
        const itemsRef = ref(database, 'items/' + itemId + '/items');
        get(itemsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const itemsArray = snapshot.val();
                
                // If the items array is empty, delete the entire item node
                if (itemsArray.length === 0) {
                    const itemParentRef = ref(database, 'items/' + itemId); // Reference to the parent item node
                    remove(itemParentRef).then(() => {
                        console.log("The entire item node is deleted because the items array is empty.");
                        fetchMenuItems('hostelCanteen', 'Himalayan'); // Refresh the menu after deletion
                    }).catch((error) => {
                        console.error("Error deleting the item node: ", error);
                    });
                } else {
                    fetchMenuItems('hostelCanteen', 'Himalayan'); // Refresh the menu to reflect the change
                }
            }
        }).catch((error) => {
            console.error("Error fetching item array after deletion: ", error);
        });
    }).catch((error) => {
        console.error("Error deleting item: ", error);
    });
}
