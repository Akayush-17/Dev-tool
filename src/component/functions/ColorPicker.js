import React, { useState, useEffect } from 'react'

const ColorPicker = () => {
  const [colors, setColors] = useState({});

  useEffect(() => {
    const scrapeColors = () => {
      const elements = document.getElementsByTagName('*');
      const colorCount = {};
      let totalCount = 0;

      // Helper function to process and count colors
      const processColor = (colorValue) => {
        if (colorValue && colorValue !== 'rgba(0, 0, 0, 0)' && colorValue !== 'transparent') {
          const normalizedColor = normalizeColor(colorValue);
          colorCount[normalizedColor] = (colorCount[normalizedColor] || 0) + 1;
          totalCount++;
        }
      };

      // Helper function to extract colors from gradients
      const extractGradientColors = (gradient) => {
        const colorMatches = gradient.match(/rgba?\([\d\s,\.]+\)|#[a-f\d]{3,8}/gi);
        return colorMatches || [];
      };

      for (let element of elements) {
        const style = window.getComputedStyle(element);
        processColor(style.getPropertyValue('color'));
        processColor(style.getPropertyValue('background-color'));
        processColor(style.getPropertyValue('border-color'));
        
        // Check for box-shadow color
        const boxShadow = style.boxShadow.match(/rgba?\([\d\s,\.]+\)/);
        if (boxShadow) processColor(boxShadow[0]);

        // Check for gradient colors
        const backgroundImage = style.backgroundImage;
        if (backgroundImage.includes('gradient')) {
          const gradientColors = extractGradientColors(backgroundImage);
          gradientColors.forEach(processColor);
        }

        // Check for fill and stroke colors (SVG elements)
        if (element instanceof SVGElement) {
          processColor(style.fill);
          processColor(style.stroke);
        }
      }

      // Filter out colors with very low occurrence (less than 0.1%)
      const significantColors = Object.entries(colorCount).reduce((acc, [color, count]) => {
        const percentage = (count / totalCount) * 100;
        if (percentage >= 0.1) {
          acc[color] = Math.round(percentage);
        }
        return acc;
      }, {});

      setColors(significantColors);
    };

    // Helper function to normalize color format
    const normalizeColor = (color) => {
      if (color.startsWith('rgb')) {
        const [r, g, b, a] = color.match(/[\d.]+/g);
        return a && parseFloat(a) < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
      }
      // Convert hex to rgb
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
      }
      return color;
    };

    // Execute the scraping function
    scrapeColors();
  }, []);

  return (
    <div>
      <h2>Website Colors</h2>
      <ul>
        {Object.entries(colors).map(([color, percentage]) => (
          <li key={color} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: color,
                marginRight: '10px',
                border: '1px solid #000',
              }}
            ></div>
            <span>{color}: {percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ColorPicker;
