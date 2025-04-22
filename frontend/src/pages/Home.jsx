import Header from '../components/header/Header'
import SpecialtyMenu from '../components/specialtymenu/SpecialtyMenu'
import TopDoctors from '../components/topdoctors/TopDoctors'
import Banner from '../components/banner/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <SpecialtyMenu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home
