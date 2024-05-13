export default [
  {
    title: 'Home',
    path: '/home',
    icon: 'tabler:smart-home',
    action: 'basic',
    subject: 'auth'
  },
  {
    title: 'Prestar libro',
    path: '/books/checkout',
    icon: 'tabler:bookmarks-filled',
    action: 'basic',
    subject: 'auth'
  },
  {
    title: 'Devolver libro',
    path: '/books/checkin',
    icon: 'tabler:bookmarks',
    action: 'basic',
    subject: 'auth'
  },
  {
    title: 'CRUD de libros',
    path: '/admin/books',
    icon: 'tabler:books',
    action: 'admin',
    subject: 'auth'
  }

  /*,
  {
    title: 'CRUD de autores',
    path: '/admin/authors',
    icon: 'tabler:users-group',
    action: 'admin',
    subject: 'auth'
  }

  ,
  {
    path: '/acl',
    title: 'Access Control',
    icon: 'tabler:shield',
    action: 'basic',
    subject: 'auth'
  }
  */
]
