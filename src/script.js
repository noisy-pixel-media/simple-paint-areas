// SCRIPT.JS //

document.addEventListener('DOMContentLoaded', function() {
  
  // Assign & Initialize Variables
  const areasList = document.getElementById('areasList');
  const areaForm = document.getElementById('areaForm');
  const customerForm = document.getElementById('customerForm');
  const customerSelect = document.getElementById('customerSelect');
  const editCustomerBtn = document.getElementById('editCustomer');

  const createCustomerBtn = document.getElementById('createCustomer');
  const createAreaBtn = document.getElementById('createArea');

  let editAreaIndex = -1; // Set index for new record
  let editCustomerIndex = -1; // Set index for new record

  
  // Check for Existing Data
  let userSettings = JSON.parse(localStorage.getItem('userSettings')) || {};
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  
  let customers = JSON.parse(localStorage.getItem('customers')) || [
    {
      name: '<< SELECT OR CREATE CUSTOMER >>',
      address: '',
      areas: []
    }
  ];
    localStorage.setItem('customers', JSON.stringify(customers));
  let selCustIndex = 0;
  if (userSettings.lastCustSelected) {
    selCustIndex = parseInt(userSettings.lastCustSelected, 10);
    // console.log('try to set from local storage', selCustIndex);
  } else {
    selCustIndex = 0;
    // console.log('set from default', selCustIndex);
  }
  // Set Customer Information on Load
  setCustomerInfoCard();

  // Initial area selection to prepare for rendering
  let selectedCustomerAreas = customers[selCustIndex].areas;
  

  // Save customer selection to local storage for page reload **** Update to allow passing of index to function ****
  function saveCustIndexToLocal() {
    userSettings = { lastCustSelected: selCustIndex };
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }

  // Listen and process customer selection
  customerSelect.addEventListener('change', function() {
    selCustIndex = parseInt(this.value, 10);
    selectedCustomerAreas = customers[selCustIndex].areas;
    setCustomerInfoCard();
    renderAreas(selCustIndex);
    updateSummaryTotals(selectedCustomerAreas);
    saveCustIndexToLocal();
  });

  


  // Function to Set Customer Information Card  
  function setCustomerInfoCard() {
    const customer = customers[selCustIndex];
    document.getElementById('cardCustName').innerText = customer.name;
    document.getElementById('cardCustAddress').innerText = customer.address;
  }

  // Select first field in modal on open for keyboard friendliness
  $('#areaModal').on('shown.bs.modal', function() {
    document.getElementById('areaName').focus();
  });
  $('#customerModal').on('shown.bs.modal', function() {
    document.getElementById('customerName').focus();
  });

  // Clear Forms When Clicking Add and Not Edit
    createAreaBtn.addEventListener('click', () => { 
      editAreaIndex = -1;
      clearAreaForm(); 
    });
    createCustomerBtn.addEventListener('click', () => {
      editCustomerIndex = -1;
      clearCustomerForm();
    });


  // Save Customer Form
  customerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('addressAutoComplete').value;

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
    setCustomerInfoCard()
    updateSummaryTotals(selectedCustomerAreas);
    showToast('New customer added successfully!');
    clearCustomerForm();
  });


  
  // Clear Customer Entry Form Function
  function clearCustomerForm() {
    document.getElementById('customerName').value = '';
    document.getElementById('addressAutoComplete').value = '';
    // editCustomerIndex = -1; 
  }
  
  
  // Function to populate the customer dropdown
  function populateCustomerDropdown() {
    customerSelect.innerHTML = customers.map((customer, index) => 
    `<option value="${index}">${customer.name}</option>`).join('');
    // editCustomerBtn.style.display = 'inline-block'; 
    editCustomerBtn.onclick = () => editCustomer(selCustIndex);
  }
 
  
  // Edit Customer Form Load
  window.editCustomer = function(index) {
    const customer = customers[index];
    document.getElementById('customerName').value = customer.name;
    document.getElementById('addressAutoComplete').value = customer.address;
    editCustomerIndex = index;
    $('#customerModal').modal('show');
    document.getElementById('customerName').focus();
  };


  // Set global variables for area calculations - Define at document level to persist
  let aName = '';
  let aNameDesc = '';
  let aLength = 0;
  let aWidth = 0;
  let aHeight = 0;
  let aDoorsInt = 0;
  let aDoorsExt = 0;
  let aJambs = 0;
  let aWindows = 0;
  let aPonyWallsLnFt = 0;
  let aWindowSeatsLnFt = 0;
  let aShelvingLnFt = 0;
  let aWallPercent = 0;
  let aHasBaseboards = false;
  let aBasePercent = 0;
  let aHasCrown = false;
  let aCrownPercent = 0;
  let aHasChairRail = false;
  let aCRailPercent = 0;
  let aTwoStory = false;
  let aBaseCabLength = 0;
  let aBaseCabHeight = 0;
  let aUpperCabLength = 0;
  let aUpperCabHeight = 0;
  let aFullCabLength = 0;
  let aFullCabHeight = 0;
  let aPaintWalls = false;
  let aPaintCeiling = false;
  let aPaintTrim = false;
  let aPaintDoors = false;
  let aPaintClosets = false;
  let aAccentWall = false;
  let aNumAccentWalls = 0;
  

  let calcWallSqFt = 0;
  let calcCeilingSqFt = 0;
  let calcAccentWallSqFt = 0;
  let calcAreaPerimeter = 0;
  let calcBaseboardsLnFt = 0;
  let calcCrownLnFt = 0;
  let calcChairRailLnFt = 0;
  let calcCabinetFacialSqFt = 0;
  


  // Function to calculate and display area calculations
  function calculateAndDisplay() {
      aLength = parseFloat(document.getElementById('areaLength').value) || 0;
      aWidth = parseFloat(document.getElementById('areaWidth').value) || 0;
      aHeight = parseFloat(document.getElementById('areaHeight').value) || 0;
      aDoorsInt = parseFloat(document.getElementById('areaDoorsInt').value) || 0;
      aDoorsExt = parseFloat(document.getElementById('areaDoorsExt').value) || 0;
      aJambs = parseFloat(document.getElementById('areaJambs').value) || 0;
      // aWindows = parseFloat(document.getElementById('areaWindows').value) || 0;
      // aPonyWallsLnFt = parseFloat(document.getElementById('ponyWallsLnFt').value) || 0;
      // aWindowSeatsLnFt = parseFloat(document.getElementById('windowSeatsLnFt').value) || 0;
      // aShelvingLnFt = parseFloat(document.getElementById('shelvingLnFt').value) || 0;
      aWallPercent = parseFloat(document.getElementById('wallPercent').value) || 0;
      aHasBaseboards = document.getElementById('hasBaseboards').checked;
      aBasePercent = parseFloat(document.getElementById('basePercent').value) || 0;
      aHasCrown = document.getElementById('hasCrown').checked;
      aCrownPercent = parseFloat(document.getElementById('crownPercent').value) || 0;
      aHasChairRail = document.getElementById('hasChairRail').checked;
      aCRailPercent = parseFloat(document.getElementById('cRailPercent').value) || 0;
      // aTwoStory = document.getElementById('twoStory').checked;
      aBaseCabLength = parseFloat(document.getElementById('baseCabLength').value) || 0;
      aBaseCabHeight = parseFloat(document.getElementById('baseCabHeight').value) || 0;
      aUpperCabLength = parseFloat(document.getElementById('upperCabLength').value) || 0;
      aUpperCabHeight = parseFloat(document.getElementById('upperCabHeight').value) || 0;
      aFullCabLength = parseFloat(document.getElementById('fullCabLength').value) || 0;
      aFullCabHeight = parseFloat(document.getElementById('fullCabHeight').value) || 0;
      // aPaintWalls = document.getElementById('paintWalls').checked;
      // aPaintCeiling = document.getElementById('paintCeiling').checked;
      // aPaintTrim = document.getElementById('paintTrim').checked;
      // aPaintDoors = document.getElementById('paintDoors').checked;
      // aAccentWall = document.getElementById('hasAccentWall').checked;
      aNumAccentWalls = parseFloat(document.getElementById('numAccentWalls').value) || 0; 
      
      calcAreaPerimeter = (aLength + aWidth) * 2;
      calcWallSqFt = calcAreaPerimeter * aHeight;
      calcAccentWallSqFt = Math.ceil(calcAreaPerimeter * aHeight * (aNumAccentWalls / 4));
      calcCeilingSqFt = aLength * aWidth;
      calcBaseboardsLnFt = Math.ceil(calcAreaPerimeter * (aBasePercent / 100));
      calcCrownLnFt = Math.ceil(calcAreaPerimeter * (aCrownPercent / 100));
      calcChairRailLnFt = Math.ceil(calcAreaPerimeter * (aCRailPercent / 100 * 1.5));
      calcCabinetFacialSqFt = Math.ceil(
          (aBaseCabHeight * aBaseCabLength) + 
          (aUpperCabHeight * aUpperCabLength) + 
          (aFullCabHeight * aFullCabLength));
      calcAllDoors = aDoorsInt + aDoorsExt;
      

      document.getElementById('wallSqFt').textContent = calcWallSqFt; 
      document.getElementById('accentWallSqFt').textContent = calcAccentWallSqFt; 
      document.getElementById('ceilingSqFt').textContent = calcCeilingSqFt; 
      document.getElementById('areaPerimeter').textContent = calcAreaPerimeter; 
      document.getElementById('baseLnFt').textContent = calcBaseboardsLnFt;
      document.getElementById('crownLnFt').textContent = calcCrownLnFt;
      document.getElementById('chairRailLnFt').textContent = calcChairRailLnFt;
      document.getElementById('cabSqFt').textContent = calcCabinetFacialSqFt;
      document.getElementById('areaDoorsCount').textContent = calcAllDoors;
      document.getElementById('areaClosetsCount').textContent = 0;

  }

  // Event listener for input changes
  document.getElementById('areaLength').addEventListener('input', calculateAndDisplay);
  document.getElementById('areaWidth').addEventListener('input', calculateAndDisplay);
  document.getElementById('areaHeight').addEventListener('input', calculateAndDisplay);
  document.getElementById('wallPercent').addEventListener('input', calculateAndDisplay);
  document.getElementById('basePercent').addEventListener('input', calculateAndDisplay);
  document.getElementById('crownPercent').addEventListener('input', calculateAndDisplay);
  document.getElementById('cRailPercent').addEventListener('input', calculateAndDisplay);
  document.getElementById('baseCabLength').addEventListener('input', calculateAndDisplay);
  document.getElementById('baseCabHeight').addEventListener('input', calculateAndDisplay);
  document.getElementById('upperCabLength').addEventListener('input', calculateAndDisplay);
  document.getElementById('upperCabHeight').addEventListener('input', calculateAndDisplay);
  document.getElementById('fullCabLength').addEventListener('input', calculateAndDisplay);
  document.getElementById('fullCabHeight').addEventListener('input', calculateAndDisplay);
  document.getElementById('numAccentWalls').addEventListener('input', calculateAndDisplay);
  document.getElementById('areaDoorsInt').addEventListener('input', calculateAndDisplay);
  document.getElementById('areaDoorsExt').addEventListener('input', calculateAndDisplay);
  
  // document.getElementById('hasBaseboards').addEventListener('input', calculateAndDisplay);
  // document.getElementById('hasCrown').addEventListener('input', calculateAndDisplay);
  // document.getElementById('hasChairRail').addEventListener('input', calculateAndDisplay);


  // Function to calculate and update summary totals
  function updateSummaryTotals(areas) {
    // let totalCeilingSqFt = 0;
    // let totalWallSqFt = 0;
    let totalWallSqFtSelected = 0;
    let totalCeilingSqFtSelected = 0;
    let totalIntDoorsCountSelected = 0;
    let totalExtDoorsCountSelected = 0;
    let totalJambsCountSelected = 0;
    let totalWindowsCountSelected = 0;
    let totalBaseLengthSelected = 0;
    let totalCrownLengthSelected = 0;
    let totalChairRailLengthSelected = 0;
    let totalPonyWallsLengthSelected = 0;
    let totalWindowSeatsLengthSelected = 0;
    let totalShelvingLengthSelected = 0;
    let totalCabinetFacialSqFtSelected = 0;
    // let totalClosetsSmCountSelected = 0;
    // let totalClosetsMdCountSelected = 0;
    // let totalClosetsLgCountSelected = 0;
    
    areas.forEach(area => {
      // Prepare for future variable of trim size modifier


      // Check if the toggles are set to true and add to selected totals
      if (area.paintWalls) totalWallSqFtSelected += area.areaCalculations.wallSqFt;
      if (area.paintCeiling) totalCeilingSqFtSelected += area.areaCalculations.ceilingSqFt;
      if (area.paintTrim && area.areaFeatures.hasBaseboards) totalBaseLengthSelected += area.areaCalculations.areaPerimeter;
      if (area.paintTrim && area.areaFeatures.hasChairRail) totalChairRailLengthSelected += area.areaCalculations.areaPerimeter * 1.7;
      if (area.paintTrim && area.areaFeatures.hasCrown) totalCrownLengthSelected += area.areaCalculations.areaPerimeter;
      if (area.paintTrim && area.areaCounts.areaJambs.length>0) totalJambsCountSelected += area.areaCounts.areaJambs;
      if (area.paintDoors && area.areaCounts.areaDoorsInt.length>0) totalIntDoorsCountSelected += area.areaCounts.areaDoorsInt;
      if (area.paintDoors && area.areaCounts.areaDoorsExt.length>0) totalExtDoorsCountSelected += area.areaCounts.areaDoorsExt;
      if (area.paintTrim && area.areaCounts.areaWindows.length>0) totalWindowsCountSelected += area.areaCounts.areaWindows;
      // console.log(area.areaCalculations.ceilingSqFt);
    });

    // Update the #summary-card with the new totals
    
    document.getElementById('totalWallSqFt').textContent = totalWallSqFtSelected;
    document.getElementById('totalCeilingSqFt').textContent = totalCeilingSqFtSelected;
    document.getElementById('totalBaseboardLnFt').textContent = totalBaseLengthSelected;
    document.getElementById('totalCrownLnFt').textContent = totalCrownLengthSelected;
    document.getElementById('totalChairRailLnFt').textContent = totalChairRailLengthSelected;
    document.getElementById('totalDoorJambsCount').textContent = totalJambsCountSelected;
    document.getElementById('totalWndwSillsCount').textContent = totalWindowsCountSelected;
    document.getElementById('totalIntDoorsCount').textContent = totalIntDoorsCountSelected;
    document.getElementById('totalExtDoorsCount').textContent = totalExtDoorsCountSelected;
    
    



  }


  // Function to add a new area or update an existing one
  areaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      aName = document.getElementById('areaName').value;
      aNameDesc = document.getElementById('areaNameDesc').value;
      aLength = parseFloat(document.getElementById('areaLength').value) || 0;
      aWidth = parseFloat(document.getElementById('areaWidth').value) || 0;
      aHeight = parseFloat(document.getElementById('areaHeight').value) || 0;
      aDoorsInt = parseFloat(document.getElementById('areaDoorsInt').value) || 0;
      aDoorsExt = parseFloat(document.getElementById('areaDoorsExt').value) || 0;
      aJambs = parseFloat(document.getElementById('areaJambs').value) || 0;
      aWindows = parseFloat(document.getElementById('areaWindows').value) || 0;
      aPonyWallsLnFt = parseFloat(document.getElementById('ponyWallsLnFt').value) || 0;
      aWindowSeatsLnFt = parseFloat(document.getElementById('windowSeatsLnFt').value) || 0;
      aShelvingLnFt = parseFloat(document.getElementById('shelvingLnFt').value) || 0;
      aWallPercent = parseFloat(document.getElementById('wallPercent').value) || 0;
      aHasBaseboards = document.getElementById('hasBaseboards').checked;
      aBasePercent = parseFloat(document.getElementById('basePercent').value) || 0;
      aHasCrown = document.getElementById('hasCrown').checked;
      aCrownPercent = parseFloat(document.getElementById('crownPercent').value) || 0;
      aHasChairRail = document.getElementById('hasChairRail').checked;
      aCRailPercent = parseFloat(document.getElementById('cRailPercent').value) || 0;
      aTwoStory = document.getElementById('twoStory').checked;
      aBaseCabLength = parseFloat(document.getElementById('baseCabLength').value) || 0;
      aBaseCabHeight = parseFloat(document.getElementById('baseCabHeight').value) || 0;
      aUpperCabLength = parseFloat(document.getElementById('upperCabLength').value) || 0;
      aUpperCabHeight = parseFloat(document.getElementById('upperCabHeight').value) || 0;
      aFullCabLength = parseFloat(document.getElementById('fullCabLength').value) || 0;
      aFullCabHeight = parseFloat(document.getElementById('fullCabHeight').value) || 0;
      aAccentWall = document.getElementById('hasAccentWall').checked;
      aNumAccentWalls = parseFloat(document.getElementById('numAccentWalls').value) || 0;
      
      aPaintWalls = document.getElementById('paintWalls').checked;
      aPaintCeiling = document.getElementById('paintCeiling').checked;
      aPaintTrim = document.getElementById('paintTrim').checked;
      aPaintDoors = document.getElementById('paintDoors').checked;
      aPaintClosets = document.getElementById('paintClosets').checked;
      
      let aCreatedDate = '';
      console.log('Set CreatedDate Variable Blank',aCreatedDate);
      if (editAreaIndex === -1) {
        aCreatedDate = new Date().toLocaleString()
       } else {
        aCreatedDate = customers[selCustIndex].createdDate
       };
      console.log('Check Index and set date for new or existing',aCreatedDate);

      calculateAndDisplay();

      const newArea = {
          areaName: aName,
          areaNameDesc: aNameDesc,
          areaDimensions: {
              areaLength: aLength,
              areaWidth: aWidth,
              areaHeight: aHeight,
              ponyWallsLnFt: aPonyWallsLnFt,
              windowSeatsLnFt: aWindowSeatsLnFt,
              shelvingLnFt: aShelvingLnFt
          },
          areaCounts: {
              areaDoorsInt: aDoorsInt,
              areaDoorsExt: aDoorsExt,
              areaJambs: aJambs,
              areaWindows: aWindows             
          },
          areaFeatures: {
              hasAccentWall: aAccentWall,  
              hasBaseboards: aHasBaseboards,
              hasCrown: aHasCrown,
              hasChairRail: aHasChairRail,
              isTwoStory: aTwoStory
          },
          areaVariables: {
              wallPercent: aWallPercent,
              basePercent: aBasePercent,
              crownPercent: aCrownPercent,
              cRailPercent: aCRailPercent,
              numAccentWalls: aNumAccentWalls
          },
          areaCabinets: {
              baseCabLength: aBaseCabLength,
              baseCabHeight: aBaseCabHeight,
              upperCabLength: aUpperCabLength,
              upperCabHeight: aUpperCabHeight,
              fullCabLength: aFullCabLength,
              fullCabHeight: aFullCabHeight
          },
          areaCalculations: {
              wallSqFt: calcWallSqFt,
              ceilingSqFt: calcCeilingSqFt,
              areaPerimeter: calcAreaPerimeter,
              accentWallSqFt: calcAccentWallSqFt,
              baseboardsSqFt: calcBaseboardsLnFt,
              crownLnFt: calcCrownLnFt,
              chairRailLnFt: calcChairRailLnFt,
              cabinetFacialSqFt: calcCabinetFacialSqFt,

          },

          // Areas to Paint Toggles 
          paintWalls: aPaintWalls,
          paintCeiling: aPaintCeiling,
          paintTrim: aPaintTrim,  
          paintDoors: aPaintDoors, 
          paintClosets: aPaintClosets,

          // Date Time Logging
          createdDate: aCreatedDate,
          modifiedDate: new Date().toLocaleString()
          
      };

      if (editAreaIndex === -1) {
        customers[selCustIndex].areas.push(newArea);
      } else {
        customers[selCustIndex].areas[editAreaIndex] = newArea;
        editAreaIndex = -1;
      }
      localStorage.setItem('customers', JSON.stringify(customers));
      $('#areaModal').modal('hide');
      clearAreaForm();
      renderAreas(selCustIndex);
      updateSummaryTotals(selectedCustomerAreas);
      // showToast('New area added successfully!');
  });

  // Function to render areas to the table

  // function renderAreas(selCustIndex) {
  //     areasTable.innerHTML = '';
  //     let areas = customers[selCustIndex].areas;
  //     areas.forEach((area, index) => {
  //         const row = areasTable.insertRow();
  //         row.innerHTML = `
  //           <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Walls')" ${area.paintWalls ? 'checked' : ''}></td>
  //           <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Ceiling')" ${area.paintCeiling ? 'checked' : ''}></td>
  //           <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Trim')" ${area.paintTrim ? 'checked' : ''}></td>
  //           <td class="align-middle"><input type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Doors')" ${area.paintDoors ? 'checked' : ''}></td>
  //           <td class="align-middle">${area.areaName}</td>
  //           <td class="align-middle">${area.areaDimensions.areaLength} ft</td>
  //           <td class="align-middle">${area.areaDimensions.areaWidth} ft</td>
  //           <td class="align-middle">${area.areaDimensions.areaHeight} ft</td>`+
  //           // <td class="align-middle">${area.areaCalculations.wallSqFt} sf</td>
  //           // <td class="align-middle">${area.areaCalculations.ceilingSqFt} sf</td>
  //           // <td class="align-middle">${area.areaCalculations.areaPerimeter} lf</td>
  //           `
  //           <td>
  //               <button class="btn btn-secondary btn-sm" onclick="editArea(${selCustIndex},${index})">Edit</button>
  //               <button class="btn btn-danger btn-sm" onclick="deleteArea(${selCustIndex},${index})">Delete</button>
  //           </td>
  //           <!-- ${console.log(area, index)} -->
  //         `;
  //     });
  //     console.log("Selected Customers",selectedCustomerAreas);
  //     console.log("Rendered Areas",areas);
  // }

  function renderAreas(selCustIndex) {
    areasList.innerHTML = '';
    let areas = customers[selCustIndex].areas;
    areas.forEach((area, index) => {
        areasList.innerHTML += `
        <div class="col-md-12 col-lg-6 mb-2">
          <ul class="list-group">
            <li class="list-group-item list-group-item-secondary d-flex align-items-center">
              <span class="area-list-name col align-self-start" onclick="editArea(${selCustIndex},${index})">${area.areaName}</span>
              <span class="badge bg-info mx-1 col-1 align-self-end">
                <label class="align-middle">W:</label>
                <input class="align-middle" type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Walls')" ${area.paintWalls ? 'checked' : ''}>
              </span>
              <span class="badge bg-info mx-1 col-1 align-self-end">
                <label class="align-middle">C:</label>
                <input class="align-middle" type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Ceiling')" ${area.paintCeiling ? 'checked' : ''}>
              </span>
              <span class="badge bg-info mx-1 col-1 align-self-end">
                <label class="align-middle">T:</label>
                <input class="align-middle" type="checkbox" onclick="togglePaint(this, '${selCustIndex}', '${index}', 'Trim')" ${area.paintTrim ? 'checked' : ''}>
              </span>
              <span class="badge bg-primary mx-1 col-1 align-self-end">L:${area.areaDimensions.areaLength}</span>
              <span class="badge bg-primary mx-1 col-1 align-self-end">W:${area.areaDimensions.areaWidth}</span>
              <span class="badge bg-primary mx-1 col-1 align-self-end">H:${area.areaDimensions.areaHeight}</span>
              <!-- edit buttons or make entire list item clickable? -->
              <button class="btn btn-danger btn-sm col-1 align-self-end" onclick="deleteArea(${selCustIndex},${index})">DEL</button>
            </li>
          </ul>
        </div>  
        `;
      });
      // console.log("Rendered Areas",areas);
      // console.log("Areas List",areasList);
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
      document.getElementById('ponyWallsLnFt').value = area.areaDimensions.ponyWallsLnFt;
      document.getElementById('windowSeatsLnFt').value = area.areaDimensions.windowSeatsLnFt;
      document.getElementById('shelvingLnFt').value = area.areaDimensions.shelvingLnFt;

      document.getElementById('areaDoorsInt').value = area.areaCounts.areaDoorsInt;
      document.getElementById('areaDoorsExt').value = area.areaCounts.areaDoorsExt;
      document.getElementById('areaJambs').value = area.areaCounts.areaJambs;
      document.getElementById('areaWindows').value = area.areaCounts.areaWindows;
      
      document.getElementById('hasAccentWall').checked = area.areaFeatures.hasAccentWall;
      document.getElementById('hasBaseboards').checked = area.areaFeatures.hasBaseboards;
      document.getElementById('hasCrown').checked = area.areaFeatures.hasCrown;
      document.getElementById('hasChairRail').checked = area.areaFeatures.hasChairRail;
      document.getElementById('twoStory').checked = area.areaFeatures.istwoStory;
      
      document.getElementById('wallPercent').value = area.areaVariables.wallPercent;
      document.getElementById('basePercent').value = area.areaVariables.basePercent;
      document.getElementById('crownPercent').value = area.areaVariables.crownPercent;
      document.getElementById('cRailPercent').value = area.areaVariables.cRailPercent;
      document.getElementById('numAccentWalls').value = area.areaVariables.numAccentWalls;
      
      document.getElementById('baseCabLength').value = area.areaCabinets.baseCabLength;
      document.getElementById('baseCabHeight').value = area.areaCabinets.baseCabHeight;
      document.getElementById('upperCabLength').value = area.areaCabinets.upperCabLength;
      document.getElementById('upperCabHeight').value = area.areaCabinets.upperCabHeight;
      document.getElementById('fullCabLength').value = area.areaCabinets.fullCabLength;
      document.getElementById('fullCabHeight').value = area.areaCabinets.fullCabHeight;
      
      document.getElementById('paintWalls').checked = area.paintWalls;
      document.getElementById('paintCeiling').checked = area.paintCeiling;
      document.getElementById('paintTrim').checked = area.paintTrim;
      document.getElementById('paintDoors').checked = area.paintDoors;
      document.getElementById('paintClosets').checked = area.paintClosets;
      
      
      
      // Show createdDate or New Entry
      console.log('Created:',area.createdDate);
      if (area.createdDate) {
        document.getElementById('createdDate').innerHTML  = area.createdDate;
      } else {
        document.getElementById('createdDate').innerHTML  = 'New Area';
      };
      console.log('Modified:',area.modifiedDate);
      if (area.modifiedDate) {
        document.getElementById('modifiedDate').innerHTML  = area.modifiedDate;
      } else {
        document.getElementById('modifiedDate').innerHTML  = 'New Entry'; // Placeholder text for new entries
      };

      calculateAndDisplay();
      editAreaIndex = areaIndex;
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
    document.getElementById('areaDoorsInt').value = '';
    document.getElementById('areaDoorsExt').value = '';
    document.getElementById('areaJambs').value = '';
    document.getElementById('areaWindows').value = '';
    document.getElementById('ponyWallsLnFt').value = '';
    document.getElementById('windowSeatsLnFt').value = '';
    document.getElementById('shelvingLnFt').value = '';


    document.getElementById('wallPercent').value = '';
    document.getElementById('hasBaseboards').checked = false;
    document.getElementById('basePercent').value = '';
    document.getElementById('hasCrown').checked = false;
    document.getElementById('crownPercent').value = '';
    document.getElementById('hasChairRail').checked = false;
    document.getElementById('cRailPercent').value = '';
    document.getElementById('twoStory').checked = false;

    document.getElementById('baseCabLength').value = '';
    document.getElementById('baseCabHeight').value = '';
    document.getElementById('upperCabLength').value = '';
    document.getElementById('upperCabHeight').value = '';
    document.getElementById('fullCabLength').value = '';
    document.getElementById('fullCabHeight').value = '';
    document.getElementById('paintWalls').checked = false;
    document.getElementById('paintCeiling').checked = false;
    document.getElementById('paintTrim').checked = false;
    document.getElementById('paintDoors').checked = false;
    document.getElementById('numAccentWalls').value = '';
    document.getElementById('hasAccentWall').value = '';


    // Reset calculated values to default display (e.g., empty or zero)
    document.getElementById('wallSqFt').textContent = '';
    document.getElementById('accentWallSqFt').textContent = '';
    document.getElementById('ceilingSqFt').textContent = '';
    document.getElementById('areaPerimeter').textContent = '';
    document.getElementById('baseLnFt').textContent = '';
    document.getElementById('crownLnFt').textContent = '';
    document.getElementById('chairRailLnFt').textContent = '';
    document.getElementById('cabSqFt').textContent = '';
    
    // Clear the createdDate text
    // document.getElementById('createdDate').textContent = '';

  }


  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastBody = document.getElementById('toast-body');
    toastBody.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
      toast.classList.remove('show');
    }, 8000);

  }

  // Set default values and reset as appropriate for feature toggles
  document.getElementById('hasBaseboards').addEventListener('change', function() {
    const basePercent = document.getElementById('basePercent');
    if (this.checked && (basePercent.value === '' || parseInt(basePercent.value) === 0)) {basePercent.value = 100;};
    if (!this.checked && parseInt(basePercent.value) === 100) {basePercent.value = 0;}; // Reset to 0 if unchecked and not customized
  });
  document.getElementById('hasCrown').addEventListener('change', function() {
    const crownPercent = document.getElementById('crownPercent');
    if (this.checked && (crownPercent.value === '' || parseInt(crownPercent.value) === 0)) {crownPercent.value = 100;};
    if (!this.checked && parseInt(crownPercent.value) === 100) {crownPercent.value = 0;}; // Reset to 0 if unchecked and not customized
  });
  document.getElementById('hasChairRail').addEventListener('change', function() {
    const cRailPercent = document.getElementById('cRailPercent');
    if (this.checked && (cRailPercent.value === '' || parseInt(cRailPercent.value) === 0)) {cRailPercent.value = 100;};
    if (!this.checked && parseInt(cRailPercent.value) === 100) {cRailPercent.value = 0;} // Reset to 0 if unchecked and not customized
  });
  document.getElementById('hasAccentWall').addEventListener('change', function() {
    const numAccentWalls = document.getElementById('numAccentWalls');
    if (this.checked && (numAccentWalls.value === '' || parseInt(numAccentWalls.value) === 0)) {numAccentWalls.value = 1;};
    if (!this.checked && parseInt(numAccentWalls.value) === 1) {numAccentWalls.value = 0}; // Reset to 0 if unchecked and not customized
  });
  document.getElementById('paintWalls').addEventListener('change', function() {
    const wallPercent = document.getElementById('wallPercent');
    if (this.checked && (wallPercent.value === '' || parseInt(wallPercent.value) === 0)) {wallPercent.value = 100;};
    if (!this.checked && parseInt(wallPercent.value) === 100) {wallPercent.value = 0}; // Reset to 0 if unchecked and not customized
  })
  document.getElementById('areaHeight').addEventListener('change', function() {
    const areaHeight = document.getElementById('areaHeight').value || 0;
    const hasTwoStory = document.getElementById('twoStory');
    if (parseInt(areaHeight) > 12) {hasTwoStory.checked = true;};
    if (parseInt(areaHeight) <= 12) {hasTwoStory.checked = false;};
})



  // Toggle Extra Fields in Area Modal
  document.getElementById('addCabinets').addEventListener('change', function() {
    document.getElementById('toggleCabinetry').classList.toggle('d-none', !this.checked); 
  });

  document.getElementById('toggleExtraFields').addEventListener('change', function() {
    document.getElementById('extraFields').classList.toggle('d-none', !this.checked); 
  });

  document.getElementById('showCalcSection').addEventListener('change', function() {
    document.getElementById('area-form-calc-section').classList.toggle('d-none', !this.checked); 
  });
  

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
 




// Initialize Google Maps Autocomplete 
var autocomplete;
function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('addressAutoComplete'),
    {
      types: ['geocode']
    }
  );
  
  // var streetNumberInput = document.getElementById('street_number');
  // var streetInput = document.getElementById('route'); 
  // var cityInput = document.getElementById('locality');
  // var stateInput = document.getElementById('administrative_area_level_1');
  // var zipCodeInput = document.getElementById('postal_code');
  
  // autocomplete.addListener('place_changed', function() {
  //   var place = autocomplete.getPlace();
    
  //   // Address components
  //   var components = place.address_components;
    
  //   for(var i = 0; i < components.length; i++) {
  //     var type = components[i].types[0];
  
  //     if (type === 'street_number') {
  //       streetNumberInput.value = components[i].long_name;
  //     } else if (type === 'route') {
  //       streetInput.value = components[i].long_name;  
  //     } else if (type === 'locality') {
  //       cityInput.value = components[i].long_name;
  //     } else if (type === 'administrative_area_level_1') {
  //       stateInput.value = components[i].short_name; 
  //     } else if (type === 'postal_code') {
  //       zipCodeInput.value = components[i].long_name;
  //     }
  //   } 
  // });

  // Set z-index to be greater than bootstrap modal
  document.getElementById('addressAutoComplete').style.zIndex = 1051;
}

