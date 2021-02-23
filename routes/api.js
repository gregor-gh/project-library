'use strict';

const db = require("../database/db.js")



module.exports = function (app) {

  const select = async (res, _id) => {
    try {
      const items = await db.selectBook(_id)
      if(items.length)
        return res.json(items)
      else
        return res.send("no book exists")
    } catch (error) {
      console.log(error)
    }
  }
  
  const insert = async (res, title) => {
    try {
      const returnedItem = await db.insertBook(title)
      return res.json(returnedItem)
    } catch (error) {
      console.log(error)
      return res.json({"error":"error"})
    }
  }
  
  const del = async (res,_id) => {
    try {
      await db.deleteBooks(_id)
      return res.send("complete delete successful")
    } catch (error) {
      console.log(error)
      return res.send("complete delete failed")
    }
  }

  const put = async (res, _id, comment) => {
    try {
      console.log(db.updateBook(_id, comment))
      // // first select book
      // const item = await db.selectBook(_id)

      // // if returned array is zero then return error
      // if(!item.length)
      //   return res.send("no book exists") 

      // // push comment into comment array
      // const origItem = item[0]
      // const updComm = [...origItem.comments, comment]
      // const updItem = { comments: updComm}
      // const finalItem = { ...origItem, ...updItem }

      // const result = await db.updateBook(finalItem)
      //res.json(result)

    } catch (error) {
      console.log(error)
    }
  }


  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      select(res, false)
    })
    
    .post(function (req, res){
      const title = req.body.title;

      // if no title then return error
      if(!title)
        return res.send("missing required field title") 

      //response will contain new book object including atleast _id and title
      insert(res, title)    
    })
    
    .delete(function(req, res, next){
      //if successful response will be 'complete delete successful'
      del(res,"ALL")
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      select(res, bookid)
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      // return early if no comment
      if(!comment)
        return res.send("missing required field")

      //json res format same as .get
      put(res,bookid,comment)
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
