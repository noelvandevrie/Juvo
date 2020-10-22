body.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 186) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      goToSearch()
  
      document.getElementById("start_button").click();
    }
  });
  
  body.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    // if (event.keyCode === 187) {
      if (event.keyCode === 50) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("add_button").click();
    }
  });
  
  body.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    // if (event.keyCode === 189) {
      if (event.keyCode === 49) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("remove_button").click();
    }
  });
  