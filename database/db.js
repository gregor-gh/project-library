require("dotenv").config();
const { v4: uuidv4 } = require("uuid")
const CosmosClient = require("@azure/cosmos").CosmosClient
const config = require("./config");
const databaseContext = require("./databaseContext");

// create client obj db
const { endpoint, key, databaseId, containerId } = config;

const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseId);
const container = database.container(containerId);

// ensure db exists, if not create
const createDb = async() => {
  await databaseContext.create(client, databaseId, containerId);
}

const deleteDb = async() => {
  await container.delete()
}

const insertBook = async (title) => {
  // define book to create
  const book = {
    _id: uuidv4(), // fCC tests expect the id to be _id, whereas CosmosDb only allows id, so creating my own
    title: title,
    project: "Library", // Added this in so i can save money on CosmosDB
    commentcount: 0,
    comments: []
  }

  // create in azure and return the created item
  const { resource: createdItem } = await container.items.create(book)

  const { id, project, _rid, _self, _etag, _attachments, _ts, ...returnItem} = createdItem
  return returnItem 
}


const selectBook = async (_id) => {

  let query;

  // if id is specified then return comments
  if(_id) {
    query=`select c._id, c.title, c.comments from c where c._id='${_id}' and c.project='Library'`
  } else {
    query =`select c._id, c.title, c.commentcount from c where c.project='Library' order by c.title`
  }

  // fetch array of reuslts
  const { resources: items } = await container.items
  .query(query)
  .fetchAll();

  // if array has no values then no books found
  if(!items.length) {
    return "no book exists"
  }

  // if id is specified then should only be one result, return that single object instead of array
  if(_id) {
    return items[0]
  } else {
    return items
  }
}

const deleteBooks = async (_id) => {
  // if id passed is "ALL" then delete entire collection
  if(_id==="ALL") {
    await deleteDb();
    await createDb();
    return
  } else {
    // otherwise get the id using _id (using _ was fCC requirement, they expected this to be done with MongoDB)
    const query = `select c.id, c.title from c where c._id='${_id}'`
    const { resources: items } = await container.items
      .query(query)
      .fetchAll();
    
    // if returned array is zero then book id does not exist
    if(!items.length)
      return "no book exists"

    // _id should be unique so assume el 0
    const id = items[0].id  
    
    // now delete using that id and partition category (cosmos won't let me delete it without it)
    const { resource: result } = await container.item(id, "Library").delete();
    return "delete successful";
  }
  
}

const updateBook = async (_id, comment) => {

  // fetch the current book record
  let query = `select * from c where c._id='${_id}'`
  const { resources: items } = await container.items
    .query(query)
    .fetchAll();

  // if returned array is zero then book id does not exist
  if(!items.length)
    return "no book exists"

  // _id should be unique so assume el 0
  const item = items[0]

  // push new comment to comment array
  item.comments.push(comment)

  // add one to comment count
  item.commentcount++

  // update record
  const { resource : updatedItem } = await container
   .item(item.id)
   .replace(item)

  // strip out uneeded fields 
  const { id, _rid, _self, _etag, _attachments, _ts, commentcount, ...returnItem } = updatedItem;
  return returnItem

  // 

  // return updatedItem

}

module.exports = { createDb, insertBook, selectBook, deleteBooks, updateBook }