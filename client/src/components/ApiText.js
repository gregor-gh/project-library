import React from 'react'

const ApiText = () => {
  return (
    <>
      <p>New books can be posted to /api/books by passing in a book title</p>
      <code>&#123; method: "POST" body: &#123; title: Great Expectations &#125; &#125;</code>
      <p>You will receive a JSON response which will include the newly created book's _id </p>
      <code> &#123; "_id":"7a29dbce-c104-47c1-8739-eafef9b840f3","title":"Great Expectations","commentcount":0,"comments":[]&#125; </code>
      <hr/>

      <p>Comments can be posted to /api/books/:bookid</p>
      <code>&#123; method: "POST" body: &#123; comment: "What a narrative rollercoaster!" &#125; &#125;</code>
      <p>The return JSON response will include the book title and the full comment array</p>
      <code>&#123;"_id":"7a29dbce-c104-47c1-8739-eafef9b840f3","title":"Great Expectations","comments":["What a narrative rollercoaster!"]&#125;</code>
      <hr/>

      <p>A full list of books can be gotten from /api/books</p>
      <code>&#123; method: "GET" &#125;</code>
      <p>The return JSON will have an array with the full list of books and the number of comments</p>
      <code>[&#123;"_id":"e7131f05-fe7f-4540-801c-88c6d6f72e9e","title":"Test123","commentcount":0&#125;,
        <br/>&#123;"_id":"7a29dbce-c104-47c1-8739-eafef9b840f3","title":"Great Expectations","commentcount":1&#125;]</code>
      <hr/>

      <p>An individual book with the array of comments can be gotten from /api/books/:bookid</p>
      <code>&#123; method: "GET" &#125;</code>
      <p>The return JSON will include the book with its array of comments</p>
      <code>&#123;"_id":"7a29dbce-c104-47c1-8739-eafef9b840f3","title":"Great Expectations","comments":["What a narrative rollercoaster!"]&#125;</code>
      <hr/>

      <p>An individual book can be deleted from /api/books/:bookid</p>
      <code>&#123; method: "DELETE" body: &#123; title: Great Expectations &#125; &#125;</code>
      <p>The return will just be a string notifying of whether the delete was successful or not</p>
      <hr/>

      <p>The entire book collection can be deleted from /api/books</p>
      <code>&#123; method: "DELETE" &#125;</code>
      <p>The return will just be a string notifying of whether the delete was successful or not</p>
    </>
  )
}

export default ApiText
