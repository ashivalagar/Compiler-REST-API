const fetch = require('node-fetch');

function handle() {
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var url =
        "http://localhost/compile";
    var options = {
        method: "POST",
        body: formData
    };
    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            //Do whatever you want with this JSON response
        });
}