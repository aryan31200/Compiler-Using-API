var languageId, editor, config;
textarea = document.getElementById("my-editor");
checkLang();
function checkLang(){
  var presentEditors = document.getElementsByClassName("CodeMirror")[0];
  if(presentEditors)
    presentEditors.remove();

  var language=$("#lang").val();
  // console.log(language);
  if (language==='Javascript') {
    languageId = "4";
    var config = {
      lineNumbers: true,
      matchBrackets: true,
      continueComments: "Enter",
      extraKeys: {"Ctrl-Q": "toggleComment"}
    };
  } else 
  if (language==='Python') {
    languageId = "0";
    var config = {
      mode: {
        name: "python",
        version: 3, 
        singleLineStringErrors: false
      },
      lineNumbers: true,
      indentUnit: 4,
      matchBrackets: true,
      tabSize: 4
    };
  } else 
  if (language==='C') {
    languageId = "7";
    var config = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-csrc"
    };
  }else 
  if (language==='CPP') {
    languageId = "77";
    var config = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-c++src"
    };
  }else 
  if (language==='Java') {
    languageId = "8";
    var config = {
      lineNumbers: true,
      matchBrackets: true,
      mode: "text/x-java"
    };
  }
  editor=CodeMirror.fromTextArea(textarea,config);
  document.getElementsByClassName("output")[0].innerText = "OUTPUT:"

}

$("#bt").click(function(){
  var code=editor.getValue();
  var codeId;
  var data = {
    "code":code,
    "langId":languageId
  };

  // console.log(code, languageId);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "https://codequotient.com/api/executeCode/", false);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
 
  xmlhttp.onreadystatechange = function() {
    if(xmlhttp.status == 200) {
      codeId = xmlhttp.responseText;
    }
  }
  xmlhttp.send(JSON.stringify(data));
  codeId = JSON.parse(codeId);
  console.log(codeId);

  if(!codeId.error){
    var x = 0;
    var refresher = setInterval(()=>{
      getxml = new XMLHttpRequest();
      var url = "https://codequotient.com/api/codeResult/" + codeId.codeId;
      // console.log(url);
      getxml.onreadystatechange = function() {
        var data = getxml.responseText;
        if(data && (JSON.parse(data)).data != "{\"status\":\"Pending\"}") {
          response = JSON.parse(JSON.parse(data).data);
          console.log(response);
          if(response.output === "") {
            document.getElementsByClassName("output")[0].innerText = response.errors.trim();  
          } else
            document.getElementsByClassName("output")[0].innerText = response.output.trim();
          clearInterval(refresher);
        }
      }
      getxml.open("GET", url, false);
      getxml.send();  
      x++;
      if(x == 15) {
        alert("Process timed out");
        clearInterval(refresher);
      } 
    }, 1000)   
  } else {
    document.getElementsByClassName("output")[0].innerText = codeId.error;
  }
});
