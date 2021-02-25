import CommentBox from "./CommentBox.js"

const Book = ({ _id, title, commentcount, toggleComments, deleteBook, commentList, addComment,addCommentState,setAddCommentState }) => {

  return (
      <div className="book-item">
        <div className="book-element">
          {title}
        </div>
        <div className="book-element book-comments" 
          onClick={() => toggleComments(_id)}>
          Comments: {commentcount}
        </div>
        <div className="book-delete" 
          onClick={() => deleteBook(_id)}>
          X
        </div>
        {commentList._id===_id && 
          <CommentBox commentList={commentList.comments} 
            _id={_id}
            addComment={addComment}
            addCommentState={addCommentState}
            setAddCommentState={setAddCommentState}
        />}
      </div>
  )
}

export default Book
