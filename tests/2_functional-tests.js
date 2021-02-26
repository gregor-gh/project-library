/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  let id; // used later for get/put/delete tests

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        let title = "A Book"
        chai.request(server)
          .post("/api/books")
          .send({title: title})
          .end((err, res) => {
            id=res.body._id; // used later for get/put/delete tests
            assert.equal(res.status, 200)
            assert.isObject(res.body, "response should be an object")
            assert.hasAllKeys(res.body,["_id","title","commentcount","comments"], "should have all expected keys")
            assert.equal(res.body.title, title,"response title should be the same as the posted title")
            assert.equal(res.body.commentcount, 0, "comment count should initialise at zero")
            assert.isArray(res.body.comments, "comment list should be array")
          })
        done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post("/api/books")
          .send({title: ""})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.text,"missing required field title", "No title should throw error")
          })
        done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      test('Test GET /api/books', function(done){
        chai.request(server)
         .get('/api/books')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isArray(res.body, 'response should be an array');
           assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
           assert.property(res.body[0], 'title', 'Books in array should contain title');
           assert.property(res.body[0], '_id', 'Books in array should contain _id');
           done();
         }); 
        })
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
         .get('/api/books/Does-Not-Exist')
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text,"no book exists","A GET request to an ID that doesn't exist should throw error")
           done();
      });
    })
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
         .get('/api/books/'+id)
         .end(function(err, res){
           assert.equal(res.status, 200);
           assert.isObject(res.body, 'response should be an object');
           assert.hasAllKeys(res.body,["_id","title","comments"], "should have all expected keys")
           done();
      });  
    });
  })

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let comment = "A good book" // comment for test
        chai.request(server)
          .post("/api/books/"+id)
          .send({comment: comment})
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isObject(res.body, "response should be an object")
            assert.hasAllKeys(res.body,["_id","title","comments"], "should have all expected keys")
            assert.isArray(res.body.comments, "comment list should be array")
            assert.equal(res.body.comments[0],comment, "Comment should match what was posted")
          })
        done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post("/api/books/"+id)
        .send({comment: ""})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isObject(res.body, "response should be an object")
          assert.equal(res.text, "missing required field comment","")
        })
      done();
    });


      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post("/api/books/"+"DoesNotExist")
        .send({comment: "A comment"})
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.text, "response should be a string")
          assert.equal(res.text, "no book exists","")
        })
      done();
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete("/api/books/"+id)
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.isString(res.text, "response should be a string")
            assert.equal(res.text, "delete successful","resposne should confirm delete was successful")
          })
        done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete("/api/books/"+"DoesNotExist")
        .end((err, res) => {
          assert.equal(res.status, 200)
          assert.isString(res.text, "response should be a string")
          assert.equal(res.text, "no book exists","resposne should confirm delete was unsuccessful")
        })
      done();
      });

    });

  });

});
