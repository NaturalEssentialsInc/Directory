$(document).ready(function() {
  console.log("Ready!");

  // Initialize Firebase
  const config = {
    apiKey: "AIzaSyCVsSuIe_Z2LwgLZg1lzpwoagMUaCVr7Rg",
    authDomain: "effective-pancake.firebaseapp.com",
    databaseURL: "https://effective-pancake.firebaseio.com",
    projectId: "effective-pancake",
    storageBucket: "effective-pancake.appspot.com",
    messagingSenderId: "427616149244"
  };

  firebase.initializeApp(config);

  const db = firebase.database();
  const directory = db.ref("directory");
  let emailToggle = true;
  let extensionToggle = true;
  let directoryToggle = true;

  db.ref().on("value", function(snapshot) {
    console.log(snapshot.val());

  });

  $("#directory-toggle").click(function() {
    directoryToggle = !directoryToggle;

    $("#directory-table > tbody").empty();
    populate();
  })

  $("#email-toggle").click(function() {
    emailToggle = !emailToggle;

    $("#email-table > tbody").empty();
    populate();
  });

  $("#extension-toggle").click(function() {
    extensionToggle = !extensionToggle;

    $("#extension-table > tbody").empty();
    populate();
  })

  function populate() {
    directory.orderByChild("full_name").on("child_added", function(childSnapshot, prevChildKey) {
      var name = childSnapshot.val().full_name;
      var department = childSnapshot.val().department_number + " - " + childSnapshot.val().department_description;
      var email = childSnapshot.val().email;
      var extension = childSnapshot.val().extension;
      var additional = childSnapshot.val().additional_email;

      directoryToggle ? $("#directory-table > tbody").append("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td>" + department + "</td>" +
                                         "</tr>"):
                          $("#directory-table > tbody").prepend("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td>" + department + "</td>" +
                                         "</tr>");

      if (email) {
        emailToggle ? $("#email-table > tbody").append("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + email +"' target='blank'>" + email + "</a></td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + additional +"' target='blank'>" + additional + "</td>" +
                                         "</tr>"):
                      $("#email-table > tbody").prepend("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + email +"' target='blank'>" + email + "</a></td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + additional +"' target='blank'>" + additional + "</td>" +
                                         "</tr>");
      };

      if (extension) {
        extensionToggle ? $("#extension-table > tbody").append("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td>" + extension + "</td>" +
                                         "</tr>"):
                          $("#extension-table > tbody").prepend("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td>" + extension + "</td>" +
                                         "</tr>");
      };

      console.log(childSnapshot.val());
    });
  };

  populate();
});