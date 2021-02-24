import React from 'react'

const AddBook = ({ addBook }) => {
  return (
    <div>
    <form action="/api/books" method="post" onSubmit={addBook}>
      <h4>Add Book</h4>
      <input placeholder="book title" type="text" id="title" name="title"/><br/>
      <input type="submit" value="Submit" />
  </form>
    </div>
  )
}

export default AddBook
