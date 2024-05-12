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
    icon: 'tabler:books',
    action: 'basic',
    subject: 'auth'
  },
  {
    title: 'Devolver libro',
    path: '/books/checkin',
    icon: 'tabler:books',
    action: 'basic',
    subject: 'auth'
  },
  {
    path: '/acl',
    title: 'Access Control',
    icon: 'tabler:shield',
    action: 'basic',
    subject: 'auth'
  }
]
