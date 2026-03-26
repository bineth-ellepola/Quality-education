import React from 'react'
import Header from '../Component/CourseManagement/FrontPages/HeaderSection/Header'
import BeforHeader from '../Component/CourseManagement/FrontPages/HeaderSection/BeforHeader'
import Landings from '../Component/CourseManagement/FrontPages/LandingSection/Landings'
import Footer from '../Component/CourseManagement/FrontPages/LandingSection/Footer'
import Questions from '../Component/CourseManagement/FrontPages/LandingSection/Questions'

function Home() {
  return (
    <div>
      <BeforHeader />
      <Header />
      <Landings />
      <Questions />
      <Footer />
    </div>
  )
}

export default Home
