import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

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

document.addEventListener('DOMContentLoaded', () => {
    // Elements from HTML (Add Item Form)
    const addElementBtn = document.getElementById('addElement');
    const addItemForm = document.getElementById('addItemForm');
    const itemNameInput = document.getElementById('item-name');
    const itemPriceInput = document.getElementById('item-price');
    const canteenNameSelect = document.getElementById('canteen-name');
    const subCanteenNameSelect = document.getElementById('sub-canteen-name');
    const itemContainer = document.getElementById('item-container');
    const noOfItemsInput = document.getElementById('no-of-items'); // Number of items input field

    // Show Add Item Form when button is clicked
    addElementBtn.addEventListener('click', () => {
        addItemForm.style.display = 'block';
        addElementBtn.style.display = 'none';
    });

    // Function to populate sub-canteens dynamically based on selected canteen
    function updateSubCanteenOptions(canteen) {
        let subCanteens = [];

        if (canteen === 'mainCanteen') {
            subCanteens = ['Mustard Cafe', 'Cucumber Cafe', 'Cinnamon Cafe', 'Saffron Cafe'];
        } else if (canteen === 'hostelCanteen') {
            subCanteens = ['Marina Hostel Mess', 'Himalayan Hostel Mess', 'Neelagiri House Mess', 'Vivekanandha Hostel Mess'];
        } else if (canteen === 'foodCourt') {
            subCanteens = ['Department Store'];
        }

        // Clear and update sub-canteen options
        subCanteenNameSelect.innerHTML = '<option value="">Select Sub-Canteen</option>';

        subCanteens.forEach(subCanteen => {
            const option = document.createElement('option');
            option.value = subCanteen;
            option.textContent = subCanteen;
            subCanteenNameSelect.appendChild(option);
        });
    }

    // Update sub-canteen options when canteen is selected
    canteenNameSelect.addEventListener('change', () => {
        updateSubCanteenOptions(canteenNameSelect.value);
    });

    // Dynamically generate input fields based on the number of items input
    noOfItemsInput.addEventListener('input', () => {
        const numItems = parseInt(noOfItemsInput.value);
        itemContainer.innerHTML = '';  // Clear the container before adding new fields
        
        for (let i = 0; i < numItems; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item-field');
            
            const itemNameLabel = document.createElement('label');
            itemNameLabel.setAttribute('for', `item-name-${i}`);
            itemNameLabel.textContent = `Item ${i + 1} Name`;
            const itemNameField = document.createElement('input');
            itemNameField.setAttribute('type', 'text');
            itemNameField.setAttribute('id', `item-name-${i}`);
            itemNameField.setAttribute('placeholder', `Enter item ${i + 1} name`);
            itemNameField.required = true;
            
            const itemPriceLabel = document.createElement('label');
            itemPriceLabel.setAttribute('for', `item-price-${i}`);
            itemPriceLabel.textContent = `Item ${i + 1} Price`;
            const itemPriceField = document.createElement('input');
            itemPriceField.setAttribute('type', 'number');
            itemPriceField.setAttribute('id', `item-price-${i}`);
            itemPriceField.setAttribute('placeholder', `Enter item ${i + 1} price`);
            itemPriceField.required = true;
            
            itemDiv.appendChild(itemNameLabel);
            itemDiv.appendChild(itemNameField);
            itemDiv.appendChild(itemPriceLabel);
            itemDiv.appendChild(itemPriceField);
            
            itemContainer.appendChild(itemDiv);
        }
    });

    // Handle Add Item Form submission
    addItemForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const canteen = canteenNameSelect.value;
        const subCanteen = subCanteenNameSelect.value;

        // Validate if canteen and sub-canteen are selected
        if (!canteen || !subCanteen) {
            alert('Please select both canteen and sub-canteen.');
            return;
        }

        // Collect the item data based on dynamic fields
        const items = [];
        const numItems = parseInt(noOfItemsInput.value);

        for (let i = 0; i < numItems; i++) {
            const itemName = document.getElementById(`item-name-${i}`).value;
            const itemPrice = parseFloat(document.getElementById(`item-price-${i}`).value);
            
            if (itemName && itemPrice) {
                items.push({ itemName, itemPrice });
            }
        }

        // Check if there is at least one item with valid data
        if (items.length === 0) {
            alert('Please fill in at least one item with its name and price.');
            return;
        }

        // Create a new item object
        const newItem = {
            canteen,
            subCanteen,
            items
        };

        // Reference to the items node in Firebase
        const itemsRef = ref(database, 'items/');

        // Push the new item to the Firebase database
        push(itemsRef, newItem)
            .then(() => {
                alert('Items added successfully!');
                addItemForm.reset();  // Reset the form
                itemContainer.innerHTML = '';  // Clear item fields
                noOfItemsInput.value = '';  // Reset the number of items input
            })
            .catch((error) => {
                console.error('Error adding items:', error);
                alert('Error adding items');
            }).then(() => {
                window.location.href = "a-menu.html";  // Redirect after success
            });
    });

    // Handle View Item button
    document.getElementById('view-item').addEventListener("click", () => {
        window.location.href = "a-menu.html";
    });
});
