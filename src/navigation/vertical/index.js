const navigation = () => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'tabler:smart-home',
      action: 'basic',
      subject: 'auth'
    },
    {
      title: 'Second Page',
      path: '/second-page',
      icon: 'tabler:mail',
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
}

export default navigation
