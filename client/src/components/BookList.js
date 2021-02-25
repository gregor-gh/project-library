import Book from "./Book.js"

const BookList = ({ bookList, toggleComments, deleteBook, commentList, addComment, addCommentState, setAddCommentState }) => {

  const books = bookList.map((el,index) => {
    return (
      <Book key={index}
        _id={el._id}
        title={el.title}
        commentcount={el.commentcount}
        toggleComments={toggleComments}
        deleteBook={deleteBook}
        commentList={commentList}
        addComment={addComment}
        addCommentState={addCommentState}
        setAddCommentState={setAddCommentState}/>
    )
  })

  return (
    <div className="book-list">
      {books}
    </div>
  )
}

export default BookList
