const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'welcome2020',
  port: 5432,
})

var arr = [];
pool.query('select * from account', (err, res) => {
   console.log(res.rows);
//    Object.keys(res.rows[0]).forEach(function (key) {
//     console.log( key );
// });
  //   res.rows.forEach(function(row){
  //       console.log(row);
  //       arr.push(row)
  //   });
  //   console.log(arr);
    pool.end()
  })

  // pool.query('EXPLAIN ANALYZE select * from account', (err, res) => {

    
  //   console.log(res.rows[0]['QUERY PLAN']);
  //   console.log(res.rows[1]['QUERY PLAN']);
  //   console.log(res.rows[2]['QUERY PLAN']);
  // })

// const query = {
//     // give the query a unique name
//     name: 'fetch-user',
//     text: 'EXPLAIN ANALYZE select * from account',
//     values: [1]
//   }
//   const client = new Client()

//   // callback
//   client.query(query, (err, res) => {
//     if (err) {
//         console.log('err')
//       console.log(err.stack)
//     } else {
        
//       console.log(res.rows[0])
//     }
//   })
  
//   // promise
//    client.query(query)
// //     .then(res => console.log(res.rows[0]))
// //     .catch(e => console.error(e.stack))