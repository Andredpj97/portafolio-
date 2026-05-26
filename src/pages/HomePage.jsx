import PropTypes from 'prop-types'
import HomeCarousel from '../sections/HomeCarousel'
import BenefitsStrip from '../sections/BenefitsStrip'
import CategoriesSection from '../sections/CategoriesSection'
import TopSellersSection from '../sections/TopSellersSection'
import BrandsStrip from '../sections/BrandsStrip'
import SpecialOffersSection from '../sections/SpecialOffersSection'
import HomeCta from '../sections/HomeCta'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'

const HomePage = ({ products, onNavigateToProducts, onNavigateToSection, onCategorySelect }) => (
  <>
    <HomeCarousel
      onPrimaryAction={onNavigateToProducts}
      onNavigateToSection={onNavigateToSection}
    />
    <BenefitsStrip />
    <ScrollReveal delay={0.1}>
      <CategoriesSection onCategorySelect={onCategorySelect} />
    </ScrollReveal>
    <ScrollReveal delay={0.1}>
      <TopSellersSection products={products} onNavigateToProducts={onNavigateToProducts} />
    </ScrollReveal>
    <ScrollReveal delay={0.1}>
      <BrandsStrip products={products} />
    </ScrollReveal>
    <ScrollReveal delay={0.1}>
      <SpecialOffersSection products={products} />
    </ScrollReveal>
    <ScrollReveal delay={0.1}>
      <HomeCta
        onNavigateToProducts={onNavigateToProducts}
        onNavigateToSection={onNavigateToSection}
      />
    </ScrollReveal>
    <ScrollReveal delay={0.1}>
      <Footer />
    </ScrollReveal>
  </>
)

HomePage.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  onNavigateToProducts: PropTypes.func.isRequired,
  onNavigateToSection: PropTypes.func.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
}

export default HomePage
