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
  let autoGroups = [];
  let autoId = 1;
  let groupId = 1;

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

      var groupData = {};
      groupData.id = groupId;
      groupData.name = department;
      groupData.ignore = false;

      autoGroups.push(groupData);
      groupId++;

      console.log(JSON.stringify(groupData));

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

  $("#myInput2").autocomplete({
    nameProperty: 'name',
    valueField: '#hidden-field2',
    dataSource: autoOptions
  });

  $("#myInput3").autocomplete({
    nameProperty: 'name',
    valueField: '#hidden-field3',
    dataSource: autoGroups,
    distinct: true
  });

  $("#search").on("click", function(e) {
    e.preventDefault();
    var query = encodeURIComponent($("#myInput").val().trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"full_name\"&equalTo=\"" + query + "\"";
    $("#displayTabs li:last-child a").tab('show');
    $("#display > div").remove();

    getData(url);

    $("#myInput").val("");

  });

  $("#search2").on("click", function(e) {
    e.preventDefault();
    var query = encodeURIComponent($("#myInput2").val().trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"full_name\"&equalTo=\"" + query + "\"";
    $("#displayTabs li:last-child a").tab('show');
    $("#display > div").remove();

    getData(url);

    $("#myInput2").val("");

  });

  $("#search3").on("click", function(e) {
    e.preventDefault();
    var inputArr = $("#myInput3").val().trim().split('-');
    var query = encodeURIComponent(inputArr[0].trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"department_number\"&equalTo=" + parseInt(query);
    $("#displayTabs li:last-child a").tab('show');
    $("#display > div").remove();

    getData(url);

    $("#myInput3").val("");

  });


  function getData(url) {

    $.ajax({
      url: url,
      type: "GET",
      dataType: "JSONP",
      success: function(response) {
        console.log("response: " + JSON.stringify(response));

        let x = [];

        for (var property in response) {
          if (response.hasOwnProperty(property)) {
            x.push(response[property]);
          };
        };

        for (i in x) {
          let name = x[i].full_name;
          let email = x[i].email;
          let department = x[i].department_number + " - " + x[i].department_description;
          let extension = x[i].extension;

          $("#display").append("<div class='row'><table class='table table-sm'><tr><th scope='row'>Name:    </td><td>" +
            name + "</td></tr><tr><th scope='row'>Email:    </td><td>" +
            email + "</td></tr><tr><th scope='row'>Department:    </td><td>" +
            department + "</td></tr><tr><th scope='row'>Extension:    </td><td>" +
            extension + "</td></tr></table><hr /></div>");
          console.log(response);
        };
      }
    });

  };

  populate();
});