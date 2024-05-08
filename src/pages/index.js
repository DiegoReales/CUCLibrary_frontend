import BlankLayoutWithAppBar from 'src/@core/layouts/BlankLayoutWithAppBar'

const HomePage = () => {
  return <>Home Page</>
}
HomePage.getLayout = page => <BlankLayoutWithAppBar>{page}</BlankLayoutWithAppBar>

// HomePage.guestGuard = true

export default HomePage
