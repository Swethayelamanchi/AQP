const express = require('express')
var path = require('path');
const app = express()
app.set('view engine', 'ejs')

// postgres local connection string
const { Pool, Client } = require('pg')


app.use(express.static(path.join(__dirname, 'public')))

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.get('/', function (req, res) {
    res.render('index',{'error':0,'errormessage':'','query':''})
})

app.get('/result', (req, res,next) => {
        query = req.param('query');
        resultCount = 0 ;

        pool = new Pool({
            user: 'postgres',
            host: '10.70.0.141',
            database: 'tpch1g',
            password: 'ysu123',
            port: 5432,
        })

        GetPostgreStats(query);
        GetPostgresResult(query);

        samplePool = new Pool({
            user: 'postgres',
            host: '10.70.0.141',
            database: 's_tpch1g',
            password: 'ysu123',
            port: 5432,
        })

        GetSamplePostgreStats(query);
        GetSamplePostgresResult(query);
        queryerror = false;
        // timer = 0;
        // while (timer < 600 )
        // {
        setTimeout(function(){ 
            if(resultCount == 4)
                {
                try{
                    res.render('result',
                    {
                        'samplePlanningTime' : samplePlanningTime ,
                        'sampleExecutionTime' : sampleExecutionTime ,
                        'sampleRowsCount' : sampleRowsCount , 
                        'sampleData' : sampleTableData,
                        'planningTime' : planningTime ,
                        'executionTime' : executionTime ,
                        'rowsCount' : rowsCount , 
                        'data' : tableData,
                        'query': query
                    })
                }
                catch (error) {
                    console.log(error);
                    res.render('index',{'error':1,
                                        'errormessage': queryerror ? "SQL query is not valid. Please check the query." : "Internal error. Please try again.",
                                        'query':query});
                }
            }
            else{
                res.render('index',{'error':1,
                'errormessage': "Query timeout",
                'query':query});
            }
            }, 60000);
            // if(resultCount == 4)
            // break;
           
       // }
  });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// postgres stats request
function GetPostgreStats(query)
{
        pool.query('EXPLAIN ANALYZE ' + query , (err, res) => {
            if (!err) 
            {
                planningTime = '--';
                executionTime = '--';
                res.rows.forEach(element => {
    
                    if(element["QUERY PLAN"].includes('Aggregate'))
                        planningTime = element["QUERY PLAN"];
        
                    if(element["QUERY PLAN"].includes('Total runtime'))
                        executionTime = element["QUERY PLAN"];
                    });
                    resultCount ++;
                    console.log(resultCount)
            }
            else{
                queryerror = true;
                resultCount ++;
            }
          })
         
}

function GetPostgresResult(query)
{
        pool.query(query, (err, res) => {
            if (!err) {
                rowsCount = res.rows.length;
                tableData= res.rows;
                pool.end()
                resultCount ++;
                console.log(resultCount)
              }
              else{
                  queryerror = true;
                  resultCount ++;
              }
        })
       
}


// sample postgres stats request
function GetSamplePostgreStats(query)
{
    samplePool.query('EXPLAIN ANALYZE ' + query , (err, res) => {
            if (!err) 
            {
                samplePlanningTime = '--';
                sampleExecutionTime = '--';
                res.rows.forEach(element => {
    
                    if(element["QUERY PLAN"].includes('Aggregate '))
                    {
                        samplePlanningTime = element["QUERY PLAN"];
                    }
        
                    if(element["QUERY PLAN"].includes('Total runtime'))
                        sampleExecutionTime = element["QUERY PLAN"];
                    });
                    resultCount ++;
                    console.log(resultCount)
            }
            else{
                queryerror = true;
                resultCount ++;
              
            }
          })
         
}

function GetSamplePostgresResult(query)
{
    samplePool.query(query, (err, res) => {
            if (!err) {
                sampleRowsCount = res.rows.length;
                sampleTableData= res.rows;
                samplePool.end()
                resultCount ++;
                console.log(resultCount)
              }
              else{
                  queryerror = true;
                  resultCount ++;
              }
        })
      
}