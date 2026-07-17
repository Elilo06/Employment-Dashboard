import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useTranslation } from 'react-i18next';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const EmploymentChart = () => {
  const { t, i18n } = useTranslation(); 
  
  const [employmentData, setEmploymentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);

  useEffect(() => {
    fetch('/labourforce_monthly.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          skipEmptyLines: true,
          complete: (result) => {
            // Find the row containing the month headers
            const headerRow = result.data.find(row => row[0] === 'Labour force characteristics');
            // Find the specific Employment row
            const employmentRow = result.data.find(row => row[0] === 'Employment 11');

            if (!headerRow || !employmentRow) {
              console.error("Required data rows not found in CSV");
              setIsLoading(false);
              return;
            }

            const parsedData = [];
            for (let i = 2; i < headerRow.length; i++) {
              const month = headerRow[i];
              const rawValue = employmentRow[i];
              
              if (month && rawValue) {
                const employmentVal = parseFloat(String(rawValue).replace(/,/g, ''));
                if (!isNaN(employmentVal)) {
                  parsedData.push({ month, employment: employmentVal });
                }
              }
            }

            setEmploymentData(parsedData);
            setStartIndex(0);
            setEndIndex(parsedData.length - 1);
            setIsLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setIsLoading(false);
          }
        });
      });
  }, []);

  const formatLocalizedMonth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    if (isNaN(date)) return dateString; 
    
    return new Intl.DateTimeFormat(i18n.language || 'en', { 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  };

  const handleStartChange = (e) => {
    const val = parseInt(e.target.value);
    if (val <= endIndex) setStartIndex(val);
  };

  const handleEndChange = (e) => {
    const val = parseInt(e.target.value);
    if (val >= startIndex) setEndIndex(val);
  };

  if (isLoading) return <div>Loading chart data...</div>;

  const displayedData = employmentData.slice(startIndex, endIndex + 1);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>{t('startMonth')}</strong>
            </label>
            <select 
              value={startIndex} 
              onChange={handleStartChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {employmentData.map((dataPoint, index) => (
                <option 
                  key={`start-${index}`} 
                  value={index} 
                  disabled={index > endIndex} 
                >
                  {formatLocalizedMonth(dataPoint.month)}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>{t('endMonth')}</strong>
            </label>
            <select 
              value={endIndex} 
              onChange={handleEndChange} 
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {employmentData.map((dataPoint, index) => (
                <option 
                  key={`end-${index}`} 
                  value={index} 
                  disabled={index < startIndex} 
                >
                  {formatLocalizedMonth(dataPoint.month)}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayedData} margin={{ top: 10, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
            <XAxis 
              dataKey="month" 
              tickFormatter={formatLocalizedMonth}
              tick={{ fontSize: 12 }} 
              angle={-45} 
              textAnchor="end"
              height={60} 
              label={{ 
                value: t('bymonth_xAxisLabel'), 
                position: 'insideBottom', 
                offset: -40, 
                style: { fill: '#666', fontSize: 14, fontWeight: 'bold' } 
              }}
            />
            
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12 }}
              label={{ 
                value: t('bymonth_yAxisLabel'), 
                angle: -90, 
                position: 'insideLeft', 
                style: { textAnchor: 'middle', fill: '#666', fontSize: 14, fontWeight: 'bold' } 
              }}
            />
            
            <Tooltip 
              labelFormatter={formatLocalizedMonth}
              formatter={(value) => [`${value.toLocaleString()}k`, t('employmentLegend')]}
            />
            <Legend verticalAlign="top" height={36}/>

            <Line 
            type="monotone" 
            dataKey="employment" 
            name={t('employmentLegend')} 
            stroke="#D12C2C" 
            strokeWidth={3} 
            activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmploymentChart;