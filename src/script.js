// SCRIPT.JS //

document.addEventListener('DOMContentLoaded', function() {
  
  const areasTable = document.getElementById('areasTable').querySelector('tbody');
  const areaForm = document.getElementById('areaForm');
  const customerForm = document.getElementById('customerForm');
  let editIndex = -1; // Index of the area being edited
  let editCustomerIndex = -1; // Index of the customer being edited

  // New customer selection logic
  const customerSelect = document.getElementById('customerSelect');
  let customers = JSON.parse(localStorage.getItem('customers')) || [
    {
      name: '<< PLEASE SELECT CUSTOMER >>',
      address: '',
      areas: []
    }
  ];
  // const areas = JSON.parse(localStorage.getItem('customers').areas) || [];
  let selCustIndex = 0; // Default to the first customer
  let selectedCustomerAreas = customers[selCustIndex].areas;


  customerSelect.addEventListener('change', function() {
    selCustIndex = parseInt(this.value, 10);
    selectedCustomerAreas = customers[selCustIndex].areas;
    renderAreas(selCustIndex);
    updateSummaryTotals(selectedCustomerAreas);
  });


  // Select first field in modal on open
  $('#areaModal').on('shown.bs.modal', function() {
    document.getElementById('areaName').focus();
  });
  $('#customerModal').on('shown.bs.modal', function() {
    document.getElementById('customerName').focus();
  });

  // Clear Forms When Clicking Add and Not Edit
  const addAreaBtn = document.getElementById('createArea');
    addAreaBtn.addEventListener('click', () => {
      clearAreaForm();    
    });
  const addCustomerBtn = document.getElementById('createCustomer');
    addCustomerBtn.addEventListener('click', () => {
      clearCustomerForm();
    });



  
  
  

  customerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;

    const newCustomer = {
      name: customerName,
      address: customerAddress,
      areas: []
    };

    if (editCustomerIndex === -1) {
      customers.push(newCustomer);
    } else {
      customers[editCustomerIndex] = newCustomer;
      editCustomerIndex = -1;
    }
    localStorage.setItem('customers', JSON.stringify(customers));
    $('#customerModal').modal('hide');
    populateCustomerDropdown();
    clearCustomerForm();
    updateSummaryTotals(selectedCustomerAreas);
    showToast('New customer added successfully!');
  });


  

  function clearCustomerForm() {
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    editCustomerIndex = -1;
  }

  window.editCustomer = function(index) {
    const customer = customers[index];
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerAddress').value = customer.address;
    editCustomerIndex = index;
    $('#customerModal').modal('show');
    document.getElementById('customerName').focus();
  };
  

  // Function to populate the customer dropdown
  const editCustomerBtn = document.getElementById('editCustomer');
  function populateCustomerDropdown() {
    customerSelect.innerHTML = customers.map((customer, index) => 
        `<option value="${index}">${customer.name}</option>`
    ).join('');
  
    editCustomerBtn.style.display = 'inline-block'; 
    editCustomerBtn.onclick = () => editCustomer(selCustIndex);
  }


  // Variables for area calculations - Define at document level to persist
  let aLength = 0;
  let aWidth = 0;
  let aHeight = 0;
  let calcWallSqFt = 0;
  let calcCeilingSqFt = 0;
  let calcAreaPerimeter = 0;

  // Function to calculate and display area calculations
  function calculateAndDisplay() {
      aLength = parseFloat(document.getElementById('areaLength').value) || 0;
      aWidth = parseFloat(document.getElementById('areaWidth').value) || 0;
      aHeight = parseFloat(document.getElementById('areaHeight').value) || 0;
    
      calcWallSqFt = (aLength + aWidth) * 2 * aHeight;
      calcCeilingSqFt = aLength * aWidth;
      calcAreaPerimeter = (aLength + aWidth) * 2;

      document.getElementById('wallSqFt').textContent = calcWallSqFt;
      document.getElementById('ceilingSqFt').textContent = calcCeilingSqFt;
      document.getElementById('areaPerimeter').textContent = calcAreaPerimeter;
  }

  // Event listener for input changes
  document.getElementById('areaLength').addEventListener('input', calculateAndDisplay);
  document.getElementById('areaWidth').addEventListener('input', calculateAndDisplay);
  document.getElementById('areaHeight').addEventListener('input', calculateAndDisplay);


  customerSelect.addEventListener('change', function() {
    selCustIndex = parseInt(this.value, 10);
    renderAreas(selCustIndex);
    updateSummaryTotals(selectedCustomerAreas);
  });


  // Function to calculate and update summary totals
  function updateSummaryTotals(areas) {
    let totalWallSqFt = 0;
    let totalWallSqFtSelected = 0;
    let totalCeilingSqFt = 0;
    let totalCeilingSqFtSelected = 0;
    // let totalAreaPerimeter = 0;
    // let totalAreaPerimeterSelected = 0;
    // let totalDoorsCount = 0;
    let totalDoorsCountSelected = 0;
    // let totalJambsCount = 0;
    let totalJambsCountSelected = 0;
    // let totalWindowsCount = 0;
    let totalWindowsCountSelected = 0;
    // let totalBaseLength = 0;
    let totalBaseLengthSelected = 0;
    // let totalCrownLength = 0;
    let totalCrownLengthSelected = 0;
    // let totalChairRailLength = 0;
    let totalChairRailLengthSelected = 0;

    areas.forEach(area => {
      totalWallSqFt += area.areaCalculations.wallSqFt;
      totalCeilingSqFt += area.areaCalculations.ceilingSqFt;

      // Check if the toggles are set to true and add to selected totals
      if (area.paintWalls) totalWallSqFtSelected += area.areaCalculations.wallSqFt;
      if (area.paintCeiling) totalCeilingSqFtSelected += area.areaCalculations.ceilingSqFt;
      if (area.paintTrim && area.areaFeatures.hasBaseboards) totalBaseLengthSelected += area.areaCalculations.areaPerimeter;
      if (area.paintTrim && area.areaFeatures.hasChairRail) totalChairRailLengthSelected += area.areaCalculations.areaPerimeter * 1.7;
      if (area.paintTrim && area.areaFeatures.hasCrown) totalCrownLengthSelected += area.areaCalculations.areaPerimeter;
      if (area.paintTrim && area.areaCounts.areaJambs.length>0) totalJambsCountSelected += area.areaCounts.areaJambs;
      if (area.paintDoors && area.areaCounts.areaDoors.length>0) totalDoorsCountSelected += area.areaCounts.areaDoors;
      if (area.paintTrim && area.areaCounts.areaWindows.length>0) totalWindowsCountSelected += area.areaCounts.areaWindows;
      // console.log(area.areaCalculations.ceilingSqFt);
    });

    // Update the HTML with the new totals
    // document.getElementById('totalWallSqFt').textContent = totalWallSqFt;
    document.getElementById('totalWallSqFtSelected').textContent = totalWallSqFtSelected;
    // document.getElementById('totalCeilingSqFt').textContent = totalCeilingSqFt;
    document.getElementById('totalCeilingSqFtSelected').textContent = totalCeilingSqFtSelected;
  
    // document.getElementById('totalDoorsCount').textContent = totalDoorsCount;
    document.getElementById('totalDoorsCountSelected').textContent = totalDoorsCountSelected;
    // document.getElementById('totalJambsCount').textContent = totalJambsCount;
    document.getElementById('totalJambsCountSelected').textContent = totalJambsCountSelected;
    // document.getElementById('totalWindowsCount').textContent = totalWindowsCount;
    document.getElementById('totalWindowsCountSelected').textContent = totalWindowsCountSelected;
    // document.getElementById('totalBaseLength').textContent = totalBaseLength;
    document.getElementById('totalBaseLengthSelected').textContent = totalBaseLengthSelected;
    // document.getElementById('totalCrownLength').textContent = totalCrownLength;
    document.getElementById('totalCrownLengthSelected').textContent = totalCrownLengthSelected;
    // document.getElementById('totalChairRailLength').textContent = totalChairRailLength;
    document.getElementById('totalChairRailLengthSelected').textContent = totalChairRailLengthSelected;
    





  }


  // Function to add a new area or update an existing one
  areaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // let formAreaLength = parseFloat(document.getElementById('areaLength').value);
      // let formAreaWidth = parseFloat(document.getElementById('areaWidth').value);
      // let formAreaHeight = parseFloat(document.getElementById('areaHeight').value);
      calculateAndDisplay();
      const newArea = {
          areaName: document.getElementById('areaName').value,
          areaNameDesc: document.getElementById('areaNameDesc').value,
          areaDimensions: {
              areaLength: aLength,
              areaWidth: aWidth,
              areaHeight: aHeight
          },
          areaCounts: {
              areaDoors: parseFloat(document.getElementById('areaDoors').value),
              areaJambs: parseFloat(document.getElementById('areaJambs').value),
              areaWindows: parseFloat(document.getElementById('areaWindows').value)             
          },
          areaFeatures: {
              hasBaseboards: document.getElementById('hasBaseboards').checked,
              hasCrown: document.getElementById('hasCrown').checked,
              hasChairRail: document.getElementById('hasChairRail').checked,
          },
          areaCalculations: {
              wallSqFt: calcWallSqFt,
              ceilingSqFt: calcCeilingSqFt,
              areaPerimeter: calcAreaPerimeter
          },
          createdDate: new Date().toLocaleString(),
          // Read checkbox values 
          paintWalls: document.getElementById('paintWalls').checked,
          paintCeiling: document.getElementById('paintCeiling').checked,
          paintTrim: document.getElementById('paintTrim').checked,  
          paintDoors: document.getElementById('paintDoors').checked  

      };

      if (editIndex === -1) {
        customers[selCustIndex].areas.push(newArea);
      } else {
        customers[selCustIndex].areas[editIndex] = newArea;
        editIndex = -1;
      }
      localStorage.setItem('customers', JSON.stringify(customers));
      $('#areaModal').modal('hide');
      clearAreaForm();
      renderAreas(selCustIndex);
      updateSummaryTotals(selectedCustomerAreas);
      // showToast('New area added successfully!');
  });

  // Function to render areas to the table

  function renderAreas(selCustIndex) {
      areasTable.innerHTML = '';
      let areas = customers[selCustIndex].areas;
      areas.forEach((area, index) => {
          const row = areasTable.insertRow();
          row.innerHTML = `
            <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Walls')" ${area.paintWalls ? 'checked' : ''}></td>
            <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Ceiling')" ${area.paintCeiling ? 'checked' : ''}></td>
            <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Trim')" ${area.paintTrim ? 'checked' : ''}></td>
            <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Doors')" ${area.paintDoors ? 'checked' : ''}></td>
            <td class="align-middle">${area.areaName}</td>
            <td class="align-middle">${area.areaDimensions.areaLength} ft</td>
            <td class="align-middle">${area.areaDimensions.areaWidth} ft</td>
            <td class="align-middle">${area.areaDimensions.areaHeight} ft</td>`+
            // <td class="align-middle">${area.areaCalculations.wallSqFt} sf</td>
            // <td class="align-middle">${area.areaCalculations.ceilingSqFt} sf</td>
            // <td class="align-middle">${area.areaCalculations.areaPerimeter} lf</td>
            `
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editArea(${selCustIndex},${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteArea(${selCustIndex},${index})">Delete</button>
            </td>
            <!-- ${console.log(area, index)} -->
          `;
      });
      console.log("Selected Customers",selectedCustomerAreas);
      console.log("Rendered Areas",areas);
  }

  window.togglePaint = function(checkbox, custIndex, areaIndex, section) {
    // Toggle value on click
    customers[custIndex].areas[areaIndex][`paint${section}`] = checkbox.checked; 
    localStorage.setItem('customers', JSON.stringify(customers));
    updateSummaryTotals(selectedCustomerAreas);
  }
  

  // Edit and Delete functions
  window.editArea = function(custIndex, areaIndex) {
      console.log(custIndex, areaIndex);
      const area = customers[custIndex].areas[areaIndex];
      document.getElementById('areaName').value = area.areaName;
      document.getElementById('areaNameDesc').value = area.areaNameDesc;
      document.getElementById('areaLength').value = area.areaDimensions.areaLength;
      document.getElementById('areaWidth').value = area.areaDimensions.areaWidth;
      document.getElementById('areaHeight').value = area.areaDimensions.areaHeight;
      document.getElementById('areaDoors').value = area.areaCounts.areaDoors;
      document.getElementById('areaJambs').value = area.areaCounts.areaJambs;
      document.getElementById('areaWindows').value = area.areaCounts.areaWindows;
      // Set the checked state of the checkboxes
      document.getElementById('hasBaseboards').checked = area.areaFeatures.hasBaseboards;
      document.getElementById('hasCrown').checked = area.areaFeatures.hasCrown;
      document.getElementById('hasChairRail').checked = area.areaFeatures.hasChairRail;
      document.getElementById('paintWalls').checked = area.paintWalls;
      document.getElementById('paintCeiling').checked = area.paintCeiling;
      document.getElementById('paintTrim').checked = area.paintTrim;
      document.getElementById('paintDoors').checked = area.paintDoors;

      // Show createdDate or New Entry
      var createdDateElement = document.getElementById('createdDate');
      if (area.createdDate) {
          createdDateElement.textContent = `Created on: ${area.createdDate}`;
      } else {
          createdDateElement.textContent = 'New Entry'; // Placeholder text for new entries
      }

      calculateAndDisplay();
      editIndex = areaIndex;
      $('#areaModal').modal('show');
      updateSummaryTotals(selectedCustomerAreas);
  };

  window.deleteArea = function(custIndex, areaIndex) {
    // Set up event listener for the "Delete" button in the confirmation modal
    document.getElementById('confirmDelete').addEventListener('click', function() {
        customers[custIndex].areas.splice(areaIndex, 1);
        localStorage.setItem('customers', JSON.stringify(customers));
        updateSummaryTotals(selectedCustomerAreas);
        renderAreas(selCustIndex);
        // Close the confirmation modal
        $('#confirmationModal').modal('hide');
    });
    // Open the confirmation modal
    $('#confirmationModal').modal('show');
  };

  // Initial render
  populateCustomerDropdown();
  renderAreas(selCustIndex);
  updateSummaryTotals(selectedCustomerAreas);


  function clearAreaForm() {
    // Reset text inputs to empty strings
    document.getElementById('areaName').value = '';
    document.getElementById('areaNameDesc').value = '';
    document.getElementById('areaLength').value = '';
    document.getElementById('areaWidth').value = '';
    document.getElementById('areaHeight').value = '';
    document.getElementById('areaDoors').value = '';
    document.getElementById('areaJambs').value = '';
    document.getElementById('areaWindows').value = '';

    // Reset calculated values to default display (e.g., empty or zero)
    document.getElementById('wallSqFt').textContent = '0';
    document.getElementById('ceilingSqFt').textContent = '0';
    document.getElementById('areaPerimeter').textContent = '0';

    // Uncheck checkboxes
    document.getElementById('paintWalls').checked = false;
    document.getElementById('paintCeiling').checked = false;
    document.getElementById('paintTrim').checked = false;
    document.getElementById('paintDoors').checked = false;

    // Uncheck features
    document.getElementById('hasBaseboards').checked = false;
    document.getElementById('hasCrown').checked = false;
    document.getElementById('hasChairRail').checked = false;

    // Clear the createdDate text
    document.getElementById('createdDate').textContent = '';

  }


  function showToast(message) {
    const toastElement = document.getElementById('toast');
    const toastBody = toastElement.querySelector('.toast-body');
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }


  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    // Save the current theme preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // Check for saved theme preference in localStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }

});
 