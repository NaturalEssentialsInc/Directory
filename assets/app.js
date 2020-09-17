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
  let directoryToggle = true;
  let autoOptions = [];
  let autoGroups = [];
  let autoLocation = [];
  let autoId = 1;

  var win = $(this);

  if (win.width() < 993) {
    $('#search-bar').hide();
  } else {
    $('#search-bar').show();
  }

  $(window).on('resize', function() {

    if (win.width() < 993) {
      $('#search-bar').hide();
    } else {
      $('#search-bar').show();
    }
  });


  function clearTables() {
    $("#directory-table > tbody").empty();
    $("#contact-table > tbody").empty();   

    autoOptions = [];
    autoGroups = [];
    autoLocation = [];
    autoId = 1;
    groupId = 1;

    directoryToggle = !directoryToggle;
  };

  $(".last-toggle").click(function() {

    clearTables();

    populate("last_name");
  });

  $(".first-toggle").click(function() {

    clearTables();

    populate("first_name");
  });

  $("#location-toggle").click(function() {

    clearTables();

    populate("building_location");
  });

  $("#email-toggle").click(function() {

    clearTables();

    populate("email");
  });

  $("#extension-toggle").click(function() {

    clearTables();

    populate("extension");
  });

  $("#group-toggle").click(function() {

    clearTables();

    populate("department_number");
  });

  function populate(child) {
    directory.orderByChild(child).on("child_added", function(childSnapshot, prevChildKey) {
      var name = childSnapshot.val().full_name;
      var lastName = childSnapshot.val().last_name;
      var firstName = childSnapshot.val().first_name;
      var department = childSnapshot.val().department;
      var email = childSnapshot.val().email;
      var extension = childSnapshot.val().extension;
      if (childSnapshot.val().additional_extension !== "") {
        extension = extension + ", " + childSnapshot.val().additional_extension;
      }
      var additional = childSnapshot.val().additional_email;
      var location = childSnapshot.val().building_location;
      
      var data = {};
      data.id = autoId;
      data.name = name;
      data.ignore = false;
      
      autoOptions.push(data);

      var groupData = {};
      groupData.id = autoId;
      groupData.name = department;
      groupData.ignore = false;

      autoGroups.push(groupData);

      var locationData = {};
      locationData.id = autoId;
      locationData.name = location;
      locationData.ignore = false;

      autoLocation.push(locationData);

      autoId++;

      // console.log(JSON.stringify(groupData));

      directoryToggle ? $("#directory-table > tbody").append("<tr>" + 
                                           "<td>" + lastName + ",</td>" +
                                           "<td>" + firstName + "</td>" +                                           
                                           "<td>" + department + "</td>" +
                                           "<td>" + location + "</td>" +                                           
                                         "</tr>"):
                        $("#directory-table > tbody").prepend("<tr>" + 
                                           "<td>" + lastName + ",</td>" +
                                           "<td>" + firstName + "</td>" +
                                           "<td>" + department + "</td>" +
                                           "<td>" + location + "</td>" +                                                                                      
                                         "</tr>");

      if (email) {
        directoryToggle ? $("#contact-table > tbody").append("<tr>" + 
                                           "<td>" + lastName + "</td>" +
                                           "<td>" + firstName + "</td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + email +"' target='blank'>" + email + "</a></td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + additional +"' target='blank'>" + additional + "</td>" +
                                           // "<td>" + extension + "</td>" +
                                         "</tr>"):
                          $("#contact-table > tbody").prepend("<tr>" + 
                                           "<td>" + lastName + "</td>" +
                                           "<td>" + firstName + "</td>" +                                           
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + email +"' target='blank'>" + email + "</a></td>" +
                                           "<td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + additional +"' target='blank'>" + additional + "</td>" +
                                           // "<td>" + extension + "</td>" +
                                         "</tr>");
      };

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

  $("#myInput4").autocomplete({
    nameProperty: 'name',
    valueField: '#hidden-field4',
    dataSource: autoLocation,
    distinct: true
  });

  $("#search").on("click", function(e) {
    e.preventDefault();
    var query = encodeURIComponent($("#myInput").val().trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"full_name\"&equalTo=\"" + query + "\"";
    $("#displayTabs li:last-child a").tab('show');
    $("#default-message").text("");
    $("#items").empty();
    $("#hiddenItems").empty();

    getData(url);

    $("#myInput").val("");

  });

  $("#search2").on("click", function(e) {
    e.preventDefault();
    var query = encodeURIComponent($("#myInput2").val().trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"full_name\"&equalTo=\"" + query + "\"";
    $("#displayTabs li:last-child a").tab('show');
    $("#default-message").text("");
    // $("#default-message").append("<div class='container'><buttonid='exportButton' class='btn btn-lg btn-danger clearfix'>Export to PDF</button></div>");    
    $("#items").empty();
    $("#hiddenItems").empty();
    // console.log("url: " + url);
    getData(url);

    $("#myInput2").val("");

  });

  $("#search3").on("click", function(e) {
    e.preventDefault();
    var inputArr = $("#myInput3").val().trim().split('-');
    var query = encodeURIComponent(inputArr[0].trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"department_number\"&equalTo=" + parseInt(query);
    $("#displayTabs li:last-child a").tab('show');
    $("#default-message").text("");
    $("#items").empty();
    $("#hiddenItems").empty();
    // console.log("url: " + url);
    getData(url);

    $("#myInput3").val("");

  });

  $("#search4").on("click", function(e) {
    e.preventDefault();
    var query = encodeURIComponent($("#myInput4").val().trim());
    var url = "https://effective-pancake.firebaseio.com/directory.json?orderBy=\"building_location\"&equalTo=\"" + query + "\"";
    $("#displayTabs li:last-child a").tab('show');
    $("#default-message").text("");
    $("#items").empty();
    $("#hiddenItems").empty();
    console.log("url: " + url);
    getData(url);

    $("#myInput4").val("");

  });

  $("#exportbutton").click(function () {
    console.log("click, click, BOOM!");
    // parse the HTML table element having an id=hiddenTable
    var dataSource = shield.DataSource.create({
      data: "#hiddenTable",
      schema: {
        type: "table",
        fields: {
          Name: { type: String },
          Department: { type: String },
          Position: { type: String },
          Location: { type: String },
          Email: { type: String },          
          // Extension: { type: String }
        }
      }
    });

    // when parsing is done, export the data to PDF
    dataSource.read().then(function (data) {
      var pdf = new shield.exp.PDFDocument({
        author: "Company Directory",
        created: new Date(),
        fontSize: 8
      });

      pdf.addPage("a4", "landscape");

      pdf.table(
        50,
        50,
        data,
        [
          { field: "Name", title: "Name", width: 90 },
          { field: "Department", title: "Department", width: 155 },
          { field: "Position", title: "Position", width: 100 },
          { field: "Location", title: "Location", width: 170 },
          { field: "Email", title: "Email", width: 180 },
          // { field: "Extension", title: "Extension", width: 40 }
        ],
        {
          margins: {
            top: 50,
            left: 50
          }
        }
      );

      pdf.saveAs({
        fileName: "DirectoryPDF"
      });
    });
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
          if (x[i].additional_email !== "") {
            email = email + ", " + x[i].additional_email;
          }
          let department = x[i].department;
          let position = x[i].job;
          // let extension = x[i].extension;
          // if (x[i].additional_extension !== "") {
          //   extension = extension + ", " + x[i].additional_extension;
          // }
          let location = x[i].building_location;

          $("#items").append("<tr><th scope='row'>Name:    </td><td>" +
            name + "</td></tr><tr><th scope='row'>Department:    </td><td>" +
            department + "</td></tr><tr><th scope='row'>Position:    </td><td>" +
            position + "</td></tr><tr><th scope='row'>Location:    </td><td>" +
            location + "</td></tr><tr><th scope='row'>Email:    </td><td><a href='https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&to=" + email +"' target='blank'>" + 
            email + "</a></td></tr><tr><th scope='row'></td><td>" +
            /*extension + "</td></tr><tr><td colspan='2'><hr /></td></tr>"*/"");

          $("#hiddenItems").append("<tr><td>" + name + "</td><td>" + department + "</td><td>" + position + "</td><td>" + location + "</td><td>" + email + "</td></tr>");
        };

      }

    });

    $("#exportbutton").show();

  };

  populate("last_name");
});