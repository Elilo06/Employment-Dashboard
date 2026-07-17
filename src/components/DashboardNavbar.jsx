import { Navbar, Container, Button, ButtonGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

function DashboardNavbar() {
  const { t, i18n } = useTranslation()

  const switchTo = (lng) => {
    i18n.changeLanguage(lng)
    document.documentElement.lang = lng   // good for accessibility/SEO
  }

  return (
    <Navbar  
      data-bs-theme="dark" 
      className="mb-4 shadow-sm py-3" 
      style={{ backgroundColor: '#4E60A6'}}
    >
      <Container>
        <Navbar.Brand 
          style={{ 
            fontFamily: "sans-serif", 
            fontSize: '1.5rem', 
            fontWeight: '600' ,
            display: 'flex',       
            alignItems: 'center',  
            gap: '10px'
          }}
        >
          <img src="/Maple_Leaf.webp" alt="maple leaf" style={{ height: '1.5em', width: '1.5em' }} />
          {t('appTitle')}
        </Navbar.Brand>
        <ButtonGroup>
          <Button
            variant={i18n.language === 'en' ? 'light' : 'outline-light'}
            size="sm"
            onClick={() => switchTo('en')}
          >
            EN
          </Button>
          <Button
            variant={i18n.language === 'fr' ? 'light' : 'outline-light'}
            size="sm"
            onClick={() => switchTo('fr')}
          >
            FR
          </Button>
        </ButtonGroup>
      </Container>
    </Navbar>
  )
}

export default DashboardNavbar