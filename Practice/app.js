var spawn = require("child_process").spawn; 
      
var process = spawn('python',["./script.py", 
                        'test', 
                        'test1'] ); 

process.stdout.on('data', function(data) { 
    console.log(data.toString()); 
});