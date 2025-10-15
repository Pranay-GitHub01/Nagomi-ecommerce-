import { WallArt } from '../types';

// Generate wall art data based on the available images
const generateWallArtData = (): WallArt[] => {
  const wallArtItems: WallArt[] = [];
  
  // Define color mappings based on the file naming patterns
  const colorMappings: { [key: string]: string } = {
    'B': 'Blue',
    'G': 'Green', 
    'W': 'White',
    'M': 'Maroon',
    'Black': 'Black',
    'Blue': 'Blue',
    'C': 'Cream',
    'GB': 'Green-Blue',
    'AT': 'Antique',
    'T': 'Teal',
    'Be': 'Beige',
    'O': 'Orange'
  };

  // Generate data for WA_001 to WA_031
  for (let i = 1; i <= 31; i++) {
    const waId = `WA_${i.toString().padStart(3, '0')}`;
    const folderPath = `/wall_art/${waId}`;
    
    // Get available colors for this wall art
    const availableColors = getAvailableColors(waId);
    const variants = availableColors.map(color => ({
      id: `${waId}_${color}`,
      color: colorMappings[color] || color,
      images: [`${folderPath}/${i}.1_${color}_WA.png`, `${folderPath}/${i}.2_${color}_WA.png`],
      colorCode: getColorCode(colorMappings[color] || color)
    }));

    const wallArt: WallArt = {
      id: waId,
      _id: waId,
      skuId: waId,
      name: `Wall Art Collection ${i}`,
      description: `Beautiful wall art design ${i} featuring elegant patterns and modern aesthetics. Perfect for adding character to any room.`,
      price: 299,
      originalPrice: 399,
      images: variants[0]?.images || [],
      category: 'Wall Art',
      colors: variants.map(v => v.color),
      materials: ['Canvas', 'Premium Paper', 'Vinyl'],
      dimensions: {
        width: 24,
        height: 36
      },
      tags: ['Modern', 'Elegant', 'Decorative'],
      bestseller: i <= 5, // First 5 are bestsellers
      rating: 4.5 + (i % 5) * 0.1,
      reviews: 10 + (i % 20),
      inStock: true,
      roomTypes: ['Living Room', 'Bedroom', 'Office'],
      variants
    };

    wallArtItems.push(wallArt);
  }

  return wallArtItems;
};

// Helper function to determine available colors based on file patterns
const getAvailableColors = (waId: string): string[] => {
  const colorMap: { [key: string]: string[] } = {
    'WA_001': ['B', 'G'],
    'WA_002': ['B', 'G'],
    'WA_003': ['B', 'G', 'W'],
    'WA_004': ['B', 'G'],
    'WA_005': ['G'],
    'WA_006': ['B', 'G'],
    'WA_007': ['B', 'G', 'M'],
    'WA_008': ['Black', 'Blue', 'M'],
    'WA_009': ['G', 'M', 'W'],
    'WA_010': ['B', 'G'],
    'WA_011': ['G', 'W'],
    'WA_012': ['B', 'C', 'G', 'W'],
    'WA_013': ['B', 'G'],
    'WA_014': ['B', 'G', 'GB'],
    'WA_015': ['AT', 'T'],
    'WA_016': ['B', 'G'],
    'WA_017': ['B', 'G'],
    'WA_018': ['B', 'G'],
    'WA_019': ['B', 'G'],
    'WA_020': ['B', 'G'],
    'WA_021': ['B', 'G'],
    'WA_022': ['B', 'G'],
    'WA_023': ['Be', 'O'],
    'WA_024': ['Be'],
    'WA_025': ['Be'],
    'WA_026': ['Be'],
    'WA_027': ['W'],
    'WA_028': ['W'],
    'WA_029': ['W'],
    'WA_030': ['Black'],
    'WA_031': ['W']
  };

  return colorMap[waId] || ['W'];
};

// Helper function to get color codes for the color buttons
const getColorCode = (colorName: string): string => {
  const colorCodes: { [key: string]: string } = {
    'Blue': '#3B82F6',
    'Green': '#10B981',
    'White': '#F9FAFB',
    'Maroon': '#991B1B',
    'Black': '#1F2937',
    'Cream': '#FEF3C7',
    'Green-Blue': '#06B6D4',
    'Antique': '#D97706',
    'Teal': '#14B8A6',
    'Beige': '#F5F5DC',
    'Orange': '#F97316'
  };
  
  return colorCodes[colorName] || '#6B7280'; // Default gray if color not found
};

export const wallArtData = generateWallArtData();
