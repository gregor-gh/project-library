import Comment from "./Comment.js"

const CommentBox = ({ commentList, _id, addComment,addCommentState,setAddCommentState }) => {

  const comments = commentList.map((el, index) => {
    return (
      <Comment key={index}
        comment={el}/>
    )
  })

  return (
    <div className="comment-box">
      {comments}
      <form className="add-comment" onSubmit={(e) => addComment(e,_id)}>
        <input value={addCommentState} 
          placeholder="add comment..."
          onChange={(e) => setAddCommentState(e.target.value)}/>
        <input className="button" type="submit" value="Post" />
      </form>
    </div>

  )
}

export default CommentBox
