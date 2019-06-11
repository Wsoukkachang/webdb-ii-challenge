const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());

const router = require('express').Router();

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.db3'
  },
  useNullAsDefault: true, //require for sqlite3
};

const db = knex(knexConfig);

// endpoints here

server.post('/api/zoos/', (req,res) => {
  db('zoos')
  .insert(req.body, 'id')
  .then(ids => {
    db('zoos')
      .where({id: ids[0]})
      .first()
      .then(zoo => {
        res.status(201).json(zoo)
      })
      .catch(err =>{
        res.status(500).json({ error: "Error posting data" })
      })
  })
})

server.get('/api/zoos/', (req, res) => {
  // get the roles from the database
  db('zoos')
  .then(zoos => {
    res.status(200).json(zoos);
  })
  .catch(error => {
    res.status(500).json(error);
  })
});

server.get('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .first()
  .then(zoo => {
    if(zoo) {
      res.status(200).json(zoo)
    } else {
      res.status(404).json({ message: "Zoo by ID not found" })
    }
  })
  .catch(err => {
    res.status(500).json({ error: "Error getting zoo by ID" })
  })
})

server.delete('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .del()
  .then(count => {
    if (count > 0) {
      res.status(200).json({ message: `${count} record deleted`})
    } else {
      res.status(404).json({ message: "Zoo by ID does not exist"})
    }
  })
  .catch(err => {
    res.status(500).json({ error: "Error deleting data" })
  })
})

server.put('/api/zoos/:id', (req, res) => {
  db('zoos')
  .where({ id: req.params.id })
  .update(req.body)
  .then(count => {
    if(count > 0) {
      res.status(200).json({ message: `${count} record updated`})
    } else {
      res.status(404).json({ message: "Zoo by ID does not exist"})
    }
  })
  .catch(err => {
    res.status(500).json({ error: "Error updating data" })
  })
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
