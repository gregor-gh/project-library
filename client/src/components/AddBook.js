const AddBook = ({ addBook, addBookState, setAddBookState, showAddBook, setShowAddBook }) => {
  return (
    <>
    <button id="add-book-button" className="button" onClick={() => setShowAddBook(!showAddBook)}>{showAddBook? "Hide": "Add Book" }</button>
    {showAddBook && 
      <form onSubmit={addBook} className="add-book">      
        <input
          placeholder="book title" 
          type="text" 
          id="title" 
          name="title" 
          value={addBookState}
          onChange={(e) => setAddBookState(e.target.value)}/>
        <input className="button" type="submit" value="Submit" />
      </form> 
  }
  </>
  )
}

export default AddBook
