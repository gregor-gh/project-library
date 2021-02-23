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
  await createDb()
  // define book to create
  const book = {
    _id: uuidv4(), // fCC tests expect the id to be _id, whereas CosmosDb only allows id, so creating my own
    title: title,
    commentcount: 0,
    comments: []
  }

  // create in azure and return the created item
  const { resource: createdItem } = await container.items.create(book)

  const { id, _rid, _self, _etag, _attachments, _ts, ...returnItem} = createdItem
  return returnItem 
}


const selectBook = async (_id) => {

  let query = `select c._id, c.title, c.commentcount from c`

  if(_id) {
    query=`select c._id, c.title, c.comments from c where c._id='${_id}'`
  } else {
    query=`select c._id, c.title, c.commentcount from c`
  }

  const { resources: items } = await container.items
  .query(query)
  .fetchAll();

  return items;
}

const deleteBooks = async (_id) => {
  // if id passed is "ALL" then select all books, loop throuigh deleting one-by-one
  if(_id==="ALL") {
    await deleteDb();
    return
  } else {
    const { resource: result } = await container.item(_id).delete();
    return result;
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

  // strip out uneeded fields // TODO need to finish filtering out fields as required
  const { id, _rid, _self, _etag, _attachments, _ts, ...returnItem } = updatedItem;
  console.log(updatedItem)
  return items

  // 

  // return updatedItem

}

module.exports = { createDb, insertBook, selectBook, deleteBooks, updateBook }