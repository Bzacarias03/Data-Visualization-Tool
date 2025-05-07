# Data Visualization Tool

A modern web application for creating and customizing data visualizations. Built with React and powered by Recharts, this tool allows users to upload and visualize their data in various chart formats.

## File Structure Requirements

This tool accepts CSV files with specific formatting requirements:

### Valid Format
The CSV file should have:
- A header row with column names
- Numeric values without currency symbols or special formatting
- No quotes around numeric values
- Consistent data types within columns

Example of valid data:
```csv
name,value,category
January,400,Category A
February,300,Category B
March,600,Category A
```

### Invalid Format
The following formats are not supported:
- Numbers with currency symbols or special formatting (e.g., "400,00", "600.00")
- Non-numeric values in numeric columns
- Inconsistent data types within columns
- Missing or malformed headers

Example of invalid data:
```csv
name,value,category
January,"400,00",Category A
February,300,Category B
March,"600.00",Category A
```

## Features

- 📊 Interactive data visualization using Recharts
- 📁 CSV file upload and parsing with PapaParse
- 🎨 Modern UI with Tailwind CSS
- 🔄 Real-time data updates
- 📱 Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000).

## Available Scripts

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
The build is optimized for the best performance.

## Technologies Used

- React
- Recharts for data visualization
- PapaParse for CSV parsing
- Tailwind CSS for styling
- Radix UI for accessible components

## Project Structure

- `src/` - Source code
  - `DataVisualizationEngine.js` - Core visualization logic
  - `App.js` - Main application component
  - Other React components and utilities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
