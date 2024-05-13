import useBackendApi from 'src/hooks/useBackendApi'

const useBookService = () => {
  const backendApi = useBackendApi()

  const getBooks = () => {
    return new Promise((resolve, reject) => {
      backendApi
        .get('/books')
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const getBooksAvailable = () => {
    return new Promise((resolve, reject) => {
      backendApi
        .get('/books/available')
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const getBook = bookId => {
    return new Promise((resolve, reject) => {
      backendApi
        .get(`/books/${bookId}`)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const getBookBorrowedByMe = () => {
    return new Promise((resolve, reject) => {
      backendApi
        .get(`/books/borrowed/pending/me`)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const bookCheckOut = bookId => {
    return new Promise((resolve, reject) => {
      backendApi
        .post(`/books/borrowed/checkout`, { bookId, userId: -1 })
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const bookCheckIn = bookBorrowedId => {
    return new Promise((resolve, reject) => {
      backendApi
        .put(`/books/borrowed/checkin/${bookBorrowedId}`)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const bookCreate = book => {
    return new Promise((resolve, reject) => {
      backendApi
        .post('/books', book)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const bookEdit = (bookId, book) => {
    return new Promise((resolve, reject) => {
      backendApi
        .put(`/books/${bookId}`, book)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  const bookDelete = bookId => {
    return new Promise((resolve, reject) => {
      backendApi
        .delete(`/books/${bookId}`)
        .then(({ data }) => resolve(data))
        .catch(error => reject(error))
    })
  }

  return {
    getBook,
    getBooks,
    getBooksAvailable,
    getBookBorrowedByMe,
    bookCheckOut,
    bookCheckIn,
    bookCreate,
    bookEdit,
    bookDelete
  }
}

export default useBookService
