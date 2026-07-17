import { useState } from 'react'
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap'
import DashboardNavbar from './components/DashboardNavbar'
import { useCsvData } from './util/useCsvData'
import { seriesFor, latestByProvince } from './util/transform'
import { useTranslation } from 'react-i18next'
import EmploymentChart from './components/EmploymentLineChart'
import EmploymentRateBarChart from './components/EmploymentRateBarChart'
import './App.css'

function App() {
  const { t } = useTranslation()
  const { rows, loading, error } = useCsvData('/population.csv')
  const [selectedGeo, setSelectedGeo] = useState('Canada')

  // Clicking the already-selected province resets to Canada
  const handleSelect = (geo) => {
    setSelectedGeo((current) => (current === geo ? 'Canada' : geo))
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    )
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Failed to load data: {String(error)}</Alert>
      </Container>
    )
  }

  const canadaSeries = seriesFor(rows, 'Canada')      
  const selectedSeries = seriesFor(rows, selectedGeo)  
  const provinces = latestByProvince(rows)
  const latest = canadaSeries.at(-1)

  return (
    <>
      <DashboardNavbar />
      <Container style={{ width: '70%', maxWidth: '1400px' }} className="mx-auto">

        <Row className="mb-4 align-items-stretch">
          
          <Col lg={7} className="d-flex flex-column">
            <Card className="shadow-sm mb-2 flex-grow-1">
              <Card.Body>
                <div className="employment-by-month">
                    <h1>{t('bymonth_title')}</h1>
                    <EmploymentChart /> 
                 </div>
              </Card.Body>
            </Card>
            <Card className="shadow-sm">
              <Card.Body className="py-2 text-muted" style={{ fontSize: '0.9rem' }}>
                <strong>{t('dataSourceTitle')}:</strong> {t('sourceMonthly')}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5} className="d-flex flex-column">
              <Card className="shadow-sm mb-2 flex-grow-1">
                <Card.Body className="d-flex flex-column">
                  <div className="employment-by-month">
                    <h1>{t('employmentRateByProvince')}</h1>
                 </div>
              
                  <div className="flex-grow-1 mt-3">
                    <EmploymentRateBarChart />
                  </div>
                  
                </Card.Body>
              </Card>
              <Card className="shadow-sm">
                <Card.Body className="py-2 text-muted" style={{ fontSize: '0.9rem' }}>
                  <strong>{t('dataSourceTitle')}:</strong> {t('sourceMonthly')}
                </Card.Body>
              </Card>
            </Col>
          
        </Row>

      </Container>
    </>
  )
}

export default App