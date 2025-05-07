import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';

const colorSchemes = {
  default: ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'],
  cool: ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#a4de6c'],
  warm: ['#FF8042', '#FFBB28', '#FF0000', '#FF6B6B', '#FFA07A'],
  monochrome: ['#2E4053', '#566573', '#808B96', '#ABB2B9', '#D5D8DC']
};

const DataVisualizationEngine = () => {
  const [chartType, setChartType] = useState('bar');
  const [colorScheme, setColorScheme] = useState('default');
  const [showLegend, setShowLegend] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [chartTitle, setChartTitle] = useState('Data Visualization');
  const [xAxisLabel, setXAxisLabel] = useState('X Axis');
  const [yAxisLabel, setYAxisLabel] = useState('Y Axis');
  const [dimensions, setDimensions] = useState({ width: '100%', height: 500 });
  const [currentData, setCurrentData] = useState(null);
  const [uploadedData, setUploadedData] = useState(null);
  const [availableChartTypes, setAvailableChartTypes] = useState(['bar', 'line', 'pie', 'scatter']);
  const [dataFields, setDataFields] = useState([]);

  const validateDataStructure = (headers) => {
    const hasNameValue = headers.includes('name') && headers.includes('value');
    const hasXY = headers.includes('x') && headers.includes('y');
    
    const validTypes = [];
    if (hasNameValue) {
      validTypes.push('bar', 'line', 'pie');
    }
    if (hasXY) {
      validTypes.push('scatter');
    }
    
    setAvailableChartTypes(validTypes);
    
    // If current chart type is not valid for the data, switch to first valid type
    if (!validTypes.includes(chartType) && validTypes.length > 0) {
      setChartType(validTypes[0]);
    }
    
    setDataFields(headers);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n');
        const headers = rows[0].split(',').map(header => header.trim());
        
        validateDataStructure(headers);
        
        const parsedData = rows.slice(1).map(row => {
          const values = row.split(',').map(value => value.trim());
          const dataPoint = {};
          headers.forEach((header, index) => {
            // Convert numeric values
            const value = values[index];
            dataPoint[header] = isNaN(value) ? value : Number(value);
          });
          return dataPoint;
        });

        setUploadedData(parsedData);
        setCurrentData(parsedData);
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    setCurrentData(null);
    setUploadedData(null);
    setAvailableChartTypes(['bar', 'line', 'pie', 'scatter']);
    setDataFields([]);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const renderChart = () => {
    if (!currentData) {
      return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-lg text-gray-600 mb-2">Upload your data to visualize</p>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Upload a CSV file with headers. For bar/line charts, include 'name' and 'value' columns.
            For scatter plots, include 'x' and 'y' columns.
          </p>
        </div>
      );
    }

    const colors = colorSchemes[colorScheme];

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
            <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              <Bar dataKey="value" fill={colors[0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
            <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey="name" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
              <Line type="monotone" dataKey="value" stroke={colors[0]} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={currentData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={dimensions.height / 3}
                fill="#8884d8"
                dataKey="value"
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              {showTooltip && <Tooltip />}
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis type="number" dataKey="x" name="x" label={{ value: xAxisLabel, position: 'insideBottom', offset: -5 }} />
              <YAxis type="number" dataKey="y" name="y" label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
              {showTooltip && <Tooltip cursor={{ strokeDasharray: '3 3' }} />}
              {showLegend && <Legend />}
              <Scatter name="Data Points" data={currentData} fill={colors[0]}>
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Select a chart type</div>;
    }
  };

  return (
    <div className="flex flex-col w-full p-4 bg-gray-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">{chartTitle}</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Upload Data (CSV)</label>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="border p-2 rounded"
            />
            {currentData && (
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Clear Data
              </button>
            )}
          </div>
          {dataFields.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Available fields: {dataFields.join(', ')}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Chart Type</label>
          <select
            className="border p-2 rounded"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
          >
            {availableChartTypes.includes('bar') && <option value="bar">Bar Chart</option>}
            {availableChartTypes.includes('line') && <option value="line">Line Chart</option>}
            {availableChartTypes.includes('pie') && <option value="pie">Pie Chart</option>}
            {availableChartTypes.includes('scatter') && <option value="scatter">Scatter Plot</option>}
          </select>
          {availableChartTypes.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No compatible chart types available for this data structure
            </p>
          )}
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Color Scheme</label>
          <select
            className="border p-2 rounded"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="cool">Cool</option>
            <option value="warm">Warm</option>
            <option value="monochrome">Monochrome</option>
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Chart Title</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={chartTitle}
            onChange={(e) => setChartTitle(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium">X-Axis Label</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={xAxisLabel}
            onChange={(e) => setXAxisLabel(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Y-Axis Label</label>
          <input
            type="text"
            className="border p-2 rounded"
            value={yAxisLabel}
            onChange={(e) => setYAxisLabel(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showLegend"
            checked={showLegend}
            onChange={(e) => setShowLegend(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showLegend">Show Legend</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showTooltip"
            checked={showTooltip}
            onChange={(e) => setShowTooltip(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showTooltip">Show Tooltip</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showGrid"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showGrid">Show Grid</label>
        </div>
      </div>
      
      <div className="border rounded-lg bg-white p-4 shadow-inner">
        {renderChart()}
      </div>
    </div>
  );
};

export default DataVisualizationEngine;