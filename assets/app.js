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
  let groupToggle = true;
  let autoOptions = [];
  let autoId = 1;

  db.ref().on("value", function(snapshot) {
    console.log(snapshot.val());

  });

  $("#directory-toggle").click(function() {
    directoryToggle = !directoryToggle;

    $("#directory-table > tbody").empty();
    $("#email-table > tbody").empty();   
    $("#extension-table > tbody").empty();

    populate();
  });

  $("#email-toggle").click(function() {
    emailToggle = !emailToggle;

    $("#directory-table > tbody").empty();
    $("#email-table > tbody").empty();
    $("#extension-table > tbody").empty();

    populate();
  });

  $("#extension-toggle").click(function() {
    extensionToggle = !extensionToggle;

    $("#directory-table > tbody").empty();
    $("#email-table > tbody").empty();
    $("#extension-table > tbody").empty();

    populate();
  });

  $("#group-toggle").click(function() {
    groupToggle = !groupToggle;

    $("#directory-table > tbody").empty();

    groupPopulate();
  });

  function populate() {
    directory.orderByChild("full_name").on("child_added", function(childSnapshot, prevChildKey) {
      var name = childSnapshot.val().full_name;
      var department = childSnapshot.val().department_number + " - " + childSnapshot.val().department_description;
      var email = childSnapshot.val().email;
      var extension = childSnapshot.val().extension;
      var additional = childSnapshot.val().additional_email;
      
      var data = {};
      data.id = autoId;
      data.name = name;
      data.ignore = false;
      
      autoOptions.push(data);
      autoId++;

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

  function groupPopulate() {
    directory.orderByChild("department_number").on("child_added", function(childSnapshot, prevChildKey) {
      var name = childSnapshot.val().full_name;
      var department = childSnapshot.val().department_number + " - " + childSnapshot.val().department_description;
      
      groupToggle ? $("#directory-table > tbody").append("<tr>" +
                                           "<td>" + name + "</td>" +
                                           "<td>" + department + "</td>" +
                                         "</tr>"):
                          $("#directory-table > tbody").prepend("<tr>" + 
                                           "<td>" + name + "</td>" +
                                           "<td>" + department + "</td>" +
                                         "</tr>");                                   
    });
  };

  $("#myInput").autocomplete({
    nameProperty: 'name',
    valueField: '#hidden-field',
    dataSource: autoOptions
  });

  $("#search").on("click", function(e) {
    e.preventDefault();
    var query = encodeURIComponent($("#myInput").val().trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"full_name\"&equalTo=\"" + query + "\"";
    var link = "file:///C:/Users/ian.goodnight/Documents/workbench/effective-pancake/index.html#search-results";
    // document.location.href = link;
    $("#displayTabs li:last-child a").tab('show');

    getData(url);

    $("#myInput").val("");

  })

  function getData(url) {

    $.ajax({
      url: url,
      type: "GET",
      dataType: "JSONP",
      success: function(response) {
        console.log("response: " + JSON.stringify(response));

        let x;

        for (var property in response) {
          if (response.hasOwnProperty(property)) {
            x = response[property];
          };
        };

        let name = x.full_name;
        let email = x.email;
        let department = x.department_number + " - " + x.department_description;
        let extension = x.extension;

        $("#display").append("<div class='row'><div class='col-sm-6 text-right'><pre>Name:\nEmail:\nDepartment:\nExtension:</pre></div><div class='col-sm-6'><pre>" + 
          name + "\n" + 
          email + "\n" +
          department + "\n" +
          extension + "</pre></div></div>");
        console.log(response);
      }
    });

  };

  populate();
});