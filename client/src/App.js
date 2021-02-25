import './App.css';
import Header from "./components/Header.js";
import AddBook from "./components/AddBook.js"
import BookList from "./components/BookList.js"
import ApiInfo from "./components/ApiInfo.js"
import { useState, useEffect } from "react"

function App() {

  useEffect(() => {
      getBooks()
    return () => {
      
    }
  }, [])

  const [addBookState, setAddBookState] = useState("")
  const [addCommentState, setAddCommentState] = useState("")
  const [bookList, setBookList] = useState([])
  const [commentList, setCommentList] = useState({_id: "", comments: []})
  const [showAddBook, setShowAddBook] = useState(false)
  const [showAPI, setShowAPI] = useState(false)

  const getBooks = async () => {
    try {
      const response = await fetch("/api/books")
      const data = await response.json()
      setBookList(data)
    } catch (error) {
      console.log(error)
    }
  }

  const addBook = async (e) => {
    // send a post request to api
    e.preventDefault()
    let formData = new FormData();
    formData.append("title",e.target.title.value)
    const body = new URLSearchParams(formData)

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        body
      })
      const data = await response.text()
      console.log(data)
    } catch (error) {
      console.log(error)
    }

    //reset add book input back to ""
    setAddBookState("")

    //refresh book array when done
    getBooks()
  }

  const toggleComments = async (_id, refresh) => {

    // check if the call is a refresh (i.e. when a comment has been posted)
    // check if the same comment has been selected and hide (by setting state back to default)
    if(commentList._id===_id && !refresh) {
      return setCommentList({_id: "", comments:[]})
    }

    // fetch the comment list from the api
    try {
      const response = await fetch(`/api/books/${_id}`)
      const data = await response.json()

      setCommentList({
        _id: data._id,
        comments: data.comments
      })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBook = async (_id) => {
    try {
      //send delete request to api
      await fetch(`/api/books/${_id}`, {
        method: "DELETE"
      })
      
      // refresh the book list
      getBooks();
    } catch (error) {
      console.log(error)
    }
  }

const addComment = async (e, _id) => {
  // prevent submit from refrehsing page
  e.preventDefault()

  // create formdata using comment state
  let formData = new FormData()
  formData.append("comment", addCommentState) 
  const body = new URLSearchParams(formData)

  try {
    // send post request to api
    const response = await fetch(`/api/books/${_id}`, {
      method: "POST",
      body
    })
    const data = await response.text()
    console.log(data)
  } catch (error) {
    console.log(error)
  }

  // reset comment input back to empty
  setAddCommentState("")

  // refresh comment list to show new comment
  toggleComments(_id,true)

  // refresh book list to update comment count
  getBooks()
}

  return (
    <div className="app">
      <Header />
      <AddBook 
        addBook={addBook}
        addBookState={addBookState}
        setAddBookState={setAddBookState}
        showAddBook={showAddBook}
        setShowAddBook={setShowAddBook}
        />
      <BookList 
        bookList={bookList}
        toggleComments={toggleComments}
        deleteBook={deleteBook}
        commentList={commentList}
        addComment={addComment}
        addCommentState={addCommentState}
        setAddCommentState={setAddCommentState}/>
      <ApiInfo 
        showAPI={showAPI}
        setShowAPI={setShowAPI}/>
    </div>
  );
}

export default App;
