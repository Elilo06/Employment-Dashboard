import { Card } from 'react-bootstrap'

function StatCard({ title, value, subtitle }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Subtitle className="text-muted mb-1">{title}</Card.Subtitle>
        <Card.Title as="h3">{value}</Card.Title>
        {subtitle && <small className="text-muted">{subtitle}</small>}
      </Card.Body>
    </Card>
  )
}

export default StatCard