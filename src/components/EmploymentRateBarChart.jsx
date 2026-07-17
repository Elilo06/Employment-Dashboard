import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const getAbbreviation = (geo, lng) => {
  const mapEn = {
    'Newfoundland and Labrador': 'NL',
    'Prince Edward Island': 'PEI',
    'Nova Scotia': 'NS',
    'New Brunswick': 'NB',
    'Quebec': 'QC',
    'Ontario': 'ON',
    'Manitoba': 'MB',
    'Saskatchewan': 'SK',
    'Alberta': 'AB',
    'British Columbia': 'BC'
  };
  const mapFr = {
    'Newfoundland and Labrador': 'T.-N.-L.',
    'Prince Edward Island': 'Î.-P.-É.',
    'Nova Scotia': 'N.-É.',
    'New Brunswick': 'N.-B.',
    'Quebec': 'QC',
    'Ontario': 'ON',
    'Manitoba': 'MB',
    'Saskatchewan': 'SK',
    'Alberta': 'AB',
    'British Columbia': 'C.-B.'
  };
  return lng === 'fr' ? mapFr[geo] : mapEn[geo];
};

const EmploymentRateBarChart = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const [selectedProvinces, setSelectedProvinces] = useState([]);

  useEffect(() => {

    fetch('/provinceemployment.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: false, 
          skipEmptyLines: true,
          complete: (result) => {
            let headerRow = null;
            let currentGeo = null;
            const parsedData = [];

            for (const row of result.data) {
              if (row.length > 0 && row[0] === 'Geography 5') {
                headerRow = row;
                continue;
              }
              if (headerRow) {
                if (row.length > 0 && row[0].trim() !== '') {
                  currentGeo = row[0].trim();
                }
                
                if (row.length > 1 && row[1].trim() === 'Employment rate 16') {
                  const janIdx = headerRow.indexOf('January 2026');
                  if (currentGeo !== 'Canada' && janIdx !== -1) {
                    const rate = parseFloat(row[janIdx]);
                    if (!isNaN(rate)) {
                      parsedData.push({ geo: currentGeo, rate });
                    }
                  }
                }
              }
            }
            setData(parsedData);
            setIsLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setIsLoading(false);
          }
        });
      });
  }, []);

  if (isLoading) return <div>Loading chart data...</div>;

  const chartData = data.map(item => ({
    ...item,
    abbr: getAbbreviation(item.geo, i18n.language) || item.geo
  }));

  const displayedData = selectedProvinces.length === 0
    ? chartData
    : chartData.filter(item => selectedProvinces.includes(item.abbr));

  const handleToggle = (abbr) => {
    if (selectedProvinces.includes(abbr)) {
      setSelectedProvinces(selectedProvinces.filter(p => p !== abbr));
    } else {
      setSelectedProvinces([...selectedProvinces, abbr]);
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 w-100 mb-4" style={{ minHeight: '350px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={displayedData} margin={{ top: 10, right: 30, left: 20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="abbr" 
              tick={{ fontSize: 12 }} 
              interval={0}
              height={50} 
              label={{ 
                value: t('barXAxisLabel'), 
                position: 'insideBottom', 
                offset: -10, 
                style: { fill: '#666', fontSize: 14, fontWeight: 'bold' } 
              }}
            />
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(val) => `${val}%`}
              tick={{ fontSize: 12 }}
              label={{ 
                value: t('barYAxisLabel'), 
                angle: -90, 
                position: 'insideLeft', 
                offset: -10,
                style: { textAnchor: 'middle', fill: '#666', fontSize: 14, fontWeight: 'bold' } 
              }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, t('employmentRate')]}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="rate" fill="#D12C2C" radius={[4, 4, 0, 0]} name={t('employmentRate')} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto pt-3 border-top">
        <div className="d-flex flex-wrap gap-3">
          <Form.Check 
            type="checkbox"
            id="check-all"
            label={t('all')}
            checked={selectedProvinces.length === 0}
            onChange={() => setSelectedProvinces([])} 
            className="fw-bold"
          />
          {chartData.map(item => (
            <Form.Check 
              key={item.abbr}
              type="checkbox"
              id={`check-${item.abbr}`}
              label={item.abbr}
              checked={selectedProvinces.includes(item.abbr)}
              onChange={() => handleToggle(item.abbr)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmploymentRateBarChart;