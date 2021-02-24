import './App.css';
import Header from "./components/Header.js";
import AddBook from "./components/AddBook.js"
import BookList from "./components/BookList.js"
import CommentList from "./components/CommentList.js"
import ApiInfo from "./components/ApiInfo.js"

function App() {

  const addBook = async (e) => {
    e.preventDefault()
    let formData = new FormData();
    formData.append("title",e.target.title.value)
    let body = new URLSearchParams(formData)

    const response = await fetch("/api/books", {
      method: "POST",
      body
    })
    const data = await response.text()
    console.log(data)
  }

  return (
    <div className="App">
      <Header />
      <AddBook addBook={addBook}/>
      <BookList />
      <CommentList />
      <ApiInfo />
    </div>
  );
}

export default App;
